//!native
//!nonstrict
//!optimize 2

namespace Object {
	function safeEquals(a: unknown, b: unknown) {
		if (a === 0 && b === 0) return 1 / a === 1 / b;
		// biome-ignore lint/suspicious/noSelfCompare: NaN check.
		if (a !== a && b !== b) return true;
		return a === b;
	}

	/**
	 * Returns true if the values are the same value, false otherwise.
	 * @param a
	 * @param b
	 * @returns
	 */
	export function is(a: unknown, b: unknown) {
		return a === b ? a !== 0 || 1 / a === 1 / (b as typeof a) : safeEquals(a, b);
	}
}

export = Object;
