//!native
//!nonstrict
//!optimize 2
/* eslint-disable unicorn/prefer-export-from */

import LuauPolyfillArray from "./array";
import LuauPolyfillConsole from "./console";
import LuauPolyfillError, { type Error as ErrorType } from "./error";
import LuauPolyfillInspect from "./inspect";
import LuauPolyfillNumber from "./number";
import LuauPolyfillObject from "./object";

namespace LuauPolyfill {
	export const Array = LuauPolyfillArray;
	export const ArrayUtils = LuauPolyfillArray;

	export const Number = LuauPolyfillNumber;
	export const NumberUtils = LuauPolyfillNumber;

	export const Object = LuauPolyfillObject;
	export const ObjectUtils = LuauPolyfillObject;

	export const Error = LuauPolyfillError;
	export const console = LuauPolyfillConsole;
	export const inspect = LuauPolyfillInspect;

	export type Error = ErrorType;
}

export = LuauPolyfill;
