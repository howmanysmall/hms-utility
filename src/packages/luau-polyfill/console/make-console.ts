//!native
//!nonstrict
//!optimize 2

import inspect from "../inspect";
import FormatParameters from "./format-parameters";

const INDENT = "  ";

export = () => {
	let indentDepth = 0;
	const indent = () => INDENT.rep(indentDepth);

	function log(content: unknown, ...parameters: Array<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
	}

	function debug(content: unknown, ...parameters: Array<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
	}

	function info(content: unknown, ...parameters: Array<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
	}

	function warn(content: unknown, ...parameters: Array<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		warn(indent() + message);
	}

	function errorFunction(content: unknown, ...parameters: Array<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		warn(indent() + message);
	}

	function group(content: unknown, ...parameters: Array<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
		indentDepth += 1;
	}

	function groupCollapsed(content: unknown, ...parameters: Array<unknown>) {
		const message = typeIs(content, "string") ? FormatParameters(content, ...parameters) : inspect(content);
		print(indent() + message);
		indentDepth += 1;
	}

	function groupEnd() {
		if (indentDepth > 0) indentDepth -= 1;
	}

	return {
		debug,
		error: errorFunction,
		group,
		groupCollapsed,
		groupEnd,
		info,
		log,
		warn,
	};
};
