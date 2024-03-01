//!native
//!optimize 2

import { HttpService } from "@rbxts/services";

export interface RequestAsyncOptions {
	body?: string;
	cache?: boolean | number;
	headers?: HttpHeaders;
	method?: RequestAsyncRequest["Method"];
	resolve2xxOnly?: boolean;
	retries?: number;
	retryDelay?: number;
	timeout?: number;
}

interface Url {
	domain: string;
	path?: string;
	protocol: string;
}

interface CacheEntry {
	content?: unknown;
	expires: number;
}

const APPROVED_DOMAINS = new Set<string>();
const CACHED_DATA = new Map<string, Map<string, CacheEntry>>();
const SENSIBLE_DEFAULT_CACHE = 300;
const DEFAULT_OPTIONS: RequestAsyncOptions = {
	cache: true,
	method: "GET",
	resolve2xxOnly: false,
	retries: 2,
	retryDelay: 10,
	timeout: 30,
};

function parseUrl(url: string): Url {
	const [domain, path] = url.match("^%w+://( [^/]+)([^#]*)");
	const protocol = url.match("^(%w+)://")[0] ?? "https";

	return {
		domain: `${domain}`.lower(),
		path: `${path}`,
		protocol: `${protocol}`,
	};
}

function fetchCachedData<T = unknown>(url: string): T | undefined {
	const { domain, path } = parseUrl(url);
	const cachedData = CACHED_DATA.get(domain);
	if (cachedData) {
		const entry = cachedData.get(path!);
		if (entry && entry.expires > os.time()) return entry.content as T;
		cachedData.delete(path!);
	}

	return undefined;
}

function parseResponseHeaderCsv(header: string) {
	// eslint-disable-next-line unicorn/no-array-reduce
	return header.split(",").reduce((reduction, value) => {
		const kvPair = value.split("=");
		kvPair[0] = (kvPair[0].match("^%s*(.-)%s*$")[0] as string).lower();

		if (kvPair[1] === undefined) kvPair[1] = true as never;
		else {
			const kvValue = kvPair[1].match("^%s*(.-)%s*$")[0] as string;
			kvPair[1] = (tonumber(kvValue) as never) ?? kvValue;
		}

		return reduction.set(kvPair[0], kvPair[1]);
	}, new Map<string, boolean | number | string>());
}

function getHeaderContent(headers: Record<string, boolean | number | string>, key: string) {
	key = key.lower();
	for (const [headerKey, headerValue] of pairs(headers)) if (headerKey.lower() === key) return headerValue;
	return;
}

function promptDomainApproval(url: string): Promise<void> {
	const { domain, protocol } = parseUrl(url);
	if (APPROVED_DOMAINS.has(domain)) return Promise.resolve();

	return new Promise((resolve, reject) => {
		const [success, exception] = pcall(() =>
			HttpService.RequestAsync({
				Method: "OPTIONS" as never,
				Url: `${protocol}://${domain}`,
			}),
		);

		if (success) {
			APPROVED_DOMAINS.add(domain);
			resolve();
		} else reject(exception);
	});
}

export function requestAsync<T = unknown>(url: string, options?: RequestAsyncOptions): Promise<T> {
	const cachedData = fetchCachedData<T>(url);
	if (cachedData !== undefined) return Promise.resolve(cachedData);

	const config: RequestAsyncOptions = {
		...DEFAULT_OPTIONS,
		...options,
	};

	const { domain, path, protocol } = parseUrl(url);

	return promptDomainApproval(url).then(() => {
		const httpPromise = new Promise<[string, RequestAsyncResponse]>((resolve, reject) => {
			const [success, response] = pcall(() =>
				HttpService.RequestAsync({
					Body: config.body,
					Headers: config.headers,
					Method: config.method,
					Url: url,
				}),
			);

			if (!success) return reject([response, response]);
			if (config.resolve2xxOnly && !response.Success) return reject([response.StatusMessage, response]);

			const cacheHeader = getHeaderContent(response.Headers, "cache-control");
			if (config.cache !== undefined || (config.cache !== undefined && cacheHeader !== undefined)) {
				const cachePolicy = parseResponseHeaderCsv(cacheHeader as string);
				const shouldCache =
					config.cache !== undefined || !(cachePolicy.get("no-cache") && cachePolicy.get("no-store"));

				if (shouldCache) {
					const maxAge =
						tonumber(
							typeIs(config.cache, "number")
								? config.cache < 0
									? math.huge
									: config.cache
								: cachePolicy.get("max-age") ?? SENSIBLE_DEFAULT_CACHE,
						) ?? SENSIBLE_DEFAULT_CACHE;

					if (maxAge !== undefined) {
						const expires = os.time() + maxAge;
						let cachedData = CACHED_DATA.get(domain);
						if (!cachedData) CACHED_DATA.set(domain, (cachedData = new Map()));
						cachedData.set(path!, { content: response.Body, expires });
					}
				}

				resolve([response.Body, response]);
			}
		});

		return 1 as T;
	});
}
