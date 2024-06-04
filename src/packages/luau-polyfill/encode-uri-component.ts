//!native
//!nonstrict
//!optimize 2

import { HttpService } from "@rbxts/services";
import { charCodeAt } from "./string";

export function encodeURIComponent(value: string) {
	const [valueLength] = utf8.len(value);
	if (valueLength === 0 || valueLength === undefined || valueLength === false) return "";

	const check = charCodeAt(value, 1);
	if (valueLength === 1 && (check === 0xd800 || check === 0xdfff)) throw "URI malformed";
	if (check >= 0xdc00 && check < 0xdfff) throw "URI malformed";

	const encoded = HttpService.UrlEncode(value);
	return encoded
		.gsub("%%2D", "-")[0]
		.gsub("%%5F", "_")[0]
		.gsub("%%2E", ".")[0]
		.gsub("%%21", "!")[0]
		.gsub("%%7E", "~")[0]
		.gsub("%%2A", "*")[0]
		.gsub("%%27", "'")[0]
		.gsub("%%28", "(")[0]
		.gsub("%%29", ")")[0];
}

export default encodeURIComponent;
