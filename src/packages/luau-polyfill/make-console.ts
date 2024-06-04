//!native
//!nonstrict
//!optimize 2

import inspect from "./inspect";
import FormatParameters from "./format-parameters";

const INDENT = "  ";

export = () => {
	let indentDepth = 0;
	const indent = () => INDENT.rep(indentDepth);

	function log(content: unknown, ...parameters: ReadonlyArray<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
	}

	function debug(content: unknown, ...parameters: ReadonlyArray<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
	}

	function info(content: unknown, ...parameters: ReadonlyArray<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
	}

	function warn(content: unknown, ...parameters: ReadonlyArray<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		warn(indent() + message);
	}

	function errorFunction(content: unknown, ...parameters: ReadonlyArray<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		warn(indent() + message);
	}

	function group(content: unknown, ...parameters: ReadonlyArray<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
		indentDepth += 1;
	}

	function groupCollapsed(content: unknown, ...parameters: ReadonlyArray<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
		indentDepth += 1;
	}

	function groupEnd() {
		if (indentDepth > 0) indentDepth -= 1;
	}

	const startTimes = new Map<string, number>();

	function time(label = "default") {
		if (startTimes.has(label)) {
			warn(`Timer '${label}' already exists`);
			return;
		}

		startTimes.set(label, os.clock());
	}
	function timeEnd(label = "default") {
		const finishTime = os.clock();
		const startTime = startTimes.get(label);
		if (startTime === undefined) {
			warn(`Timer '${label}' does not exist`);
			return;
		}

		log(`${label}: ${(finishTime - startTime) * 1000} ms`);
		startTimes.delete(label);
	}

	return {
		debug,
		error: errorFunction,
		group,
		groupCollapsed,
		groupEnd,
		info,
		log,
		time,
		timeEnd,
		warn,
	};
};
