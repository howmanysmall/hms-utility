import LuauPolyfillArray from "./array";
import LuauPolyfillConsole from "./console";
import LuauPolyfillError, { Error as ErrorType } from "./error";
import LuauPolyfillInspect from "./inspect";
import LuauPolyfillMath from "./math";
import LuauPolyfillNumber from "./number";
import LuauPolyfillObject from "./object";
import LuauPolyfillString from "./string";
import Timers from "./timers";

// export { Array, Error, Math, Number, String };
namespace LuauPolyfill {
	export const Array = LuauPolyfillArray;
	export const ArrayUtils = LuauPolyfillArray;

	export const Math = LuauPolyfillMath;
	export const MathUtils = LuauPolyfillMath;

	export const Number = LuauPolyfillNumber;
	export const NumberUtils = LuauPolyfillNumber;

	export const Object = LuauPolyfillObject;
	export const ObjectUtils = LuauPolyfillObject;

	export const String = LuauPolyfillString;
	export const StringUtils = LuauPolyfillString;

	export const Error = LuauPolyfillError;
	export const console = LuauPolyfillConsole;
	export const inspect = LuauPolyfillInspect;

	export const clearInterval = Timers.ClearInterval;
	export const setInterval = Timers.SetInterval;

	export const clearTimeout = Timers.ClearTimeout;
	export const setTimeout = Timers.SetTimeout;

	export type Error = ErrorType;
	export type Interval = Timers.Interval;
	export type Timer = Timers.Timer;
}

export = LuauPolyfill;
