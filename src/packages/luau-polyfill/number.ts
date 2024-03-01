//!native
//!nonstrict
//!optimize 2

namespace Number {
	// eslint-disable-next-line no-shadow-restricted-names
	export const NaN = 0 / 0;

	export function isFinite(value: unknown): value is number {
		// biome-ignore lint/suspicious/noSelfCompare: NaN check.
		return typeIs(value, "number") && value === value && value !== math.huge && value !== -math.huge;
	}

	export function Number(value: unknown): number {
		if (typeIs(value, "number")) return value;
		if (typeIs(value, "string")) return tonumber(value) ?? NaN;
		return NaN;
	}
}

export = Number;
