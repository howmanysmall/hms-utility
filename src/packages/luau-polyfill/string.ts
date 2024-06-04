//!native
//!nonstrict
//!optimize 2

import Number from "./number";

namespace String {
	export function trimStart(source: string) {
		return source.gsub("^[%s]+", "")[0];
	}

	export function trimEnd(source: string) {
		return source.gsub("[%s]+$", "")[0];
	}

	export function trim(source: string) {
		return trimStart(trimEnd(source));
	}

	export function charCodeAt(value: string, index = 1) {
		const length = value.size();
		if (index < 1 || index > length) return Number.NaN;

		const offset = utf8.offset(value, index);
		if (offset === undefined || offset > length) return Number.NaN;

		const [codepoint] = utf8.codepoint(value, offset, offset);
		return codepoint === undefined ? Number.NaN : codepoint;
	}

	export function charCodeAtJs(value: string, index = 0) {
		return charCodeAt(value, index + 1);
	}

	/**
	 * @deprecated maybe use {@linkcode sliceJs} instead. More accurate to actual TS.
	 * @param value
	 * @param startIndexString
	 * @param lastIndexString
	 * @returns
	 */
	export function slice(value: string, startIndexString: number | string, lastIndexString?: number | string): string {
		const [valueLength, invalidBytePosition] = utf8.len(value);
		assert(
			valueLength !== undefined && valueLength !== false,
			`string \`${value}\` has an invalid byte at position ${invalidBytePosition}`,
		);

		let startIndex = tonumber(startIndexString);
		assert(typeIs(startIndex, "number"), "startIndexString should convert to number");

		// then |start index| is greater than string length
		if (startIndex + valueLength < 0) startIndex = 1;
		if (startIndex > valueLength) return "";

		// if no last index length set, go to str length + 1
		let lastIndex = valueLength + 1;
		if (lastIndexString !== undefined) lastIndex = tonumber(lastIndexString) ?? Number.NaN;

		assert(typeIs(lastIndex, "number"), "lastIndexString should convert to number");
		if (lastIndex > valueLength) lastIndex = valueLength + 1;

		const startIndexByte = utf8.offset(value, startIndex);
		// get char length of charset returned at offset
		const lastIndexByte = utf8.offset(value, lastIndex)! - 1;
		return value.sub(startIndexByte!, lastIndexByte);
	}

	export function sliceJs(
		value: string,
		startIndexString: number | string,
		lastIndexString?: number | string,
	): string {
		const [valueLength, invalidBytePosition] = utf8.len(value);
		assert(
			valueLength !== undefined && valueLength !== false,
			`string \`${value}\` has an invalid byte at position ${invalidBytePosition}`,
		);

		let startIndex = tonumber(startIndexString);
		assert(typeIs(startIndex, "number"), "startIndexString should convert to number");

		// then |start index| is greater than string length
		if (startIndex + valueLength < 0) startIndex = 1;
		if (startIndex > valueLength) return "";

		// if no last index length set, go to str length + 1
		let lastIndex = valueLength + 1;
		if (lastIndexString !== undefined) lastIndex = tonumber(lastIndexString) ?? Number.NaN;

		assert(typeIs(lastIndex, "number"), "lastIndexString should convert to number");
		if (lastIndex > valueLength) lastIndex = valueLength + 1;

		// get char length of charset returned at offset
		return value.sub(utf8.offset(value, startIndex)!, utf8.offset(value, lastIndex)!);
	}
}

export = String;
