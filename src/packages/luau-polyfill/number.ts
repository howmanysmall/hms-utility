//!native
//!optimize 2

namespace Number {
	export const MAX_SAFE_INTEGER = 9_007_199_254_740_991;
	export const MIN_SAFE_INTEGER = -9_007_199_254_740_991;
	// eslint-disable-next-line no-shadow-restricted-names
	export const NaN = 0 / 0;

	export function isFinite(value: unknown): value is number {
		return typeIs(value, "number") && value === value && value !== math.huge && value !== -math.huge;
	}

	export function isInteger(value: unknown): value is number {
		return typeIs(value, "number") && value !== math.huge && value === math.floor(value);
	}

	export function isNaN(value: unknown): value is number {
		return typeIs(value, "number") && value !== value;
	}

	export function isSafeInteger(value: unknown): value is number {
		return isInteger(value) && math.abs(value) <= MAX_SAFE_INTEGER;
	}

	export function toExponential(value: number | string, fractionDigits?: number) {
		let numberValue = value;
		if (typeIs(value, "string")) numberValue = tonumber(value) ?? NaN;
		if (!typeIs(value, "number")) return "nan";

		if (fractionDigits !== undefined) {
			if (!typeIs(fractionDigits, "number"))
				error("TypeError: fractionDigits must be a number between 0 and 100");
			if (fractionDigits < 0 || fractionDigits > 100)
				error("RangeError: fractionDigits must be between 0 and 100");
		}

		const formatString = fractionDigits === undefined ? "%e" : `%.${fractionDigits}e`;
		const returnValue = formatString
			.format(numberValue)
			.gsub("%+0", "+")[0]
			.gsub("%-0", "-")[0]
			.gsub("0*e", "e")[0];

		return returnValue;
	}

	export function Number(value: unknown): number {
		if (typeIs(value, "number")) return value;
		if (typeIs(value, "string")) return tonumber(value) ?? NaN;
		return NaN;
	}
}

// setmetatable(Number, {
// 	__call: (number, value: unknown) => {
// 		if (!typeIs(value, "number")) return number;
// 		if (typeIs(value, "string")) return tonumber(value) ?? number.NaN;
// 		return number
// 	}
// });

export = Number;
