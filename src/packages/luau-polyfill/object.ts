//!native
//!optimize 2
namespace Object {
	const safeEquals = (a: unknown, b: unknown) => {
		if (a === 0 && b === 0) return 1 / a === 1 / b;
		else if (a !== a && b !== b) return true;
		else return a === b;
	};

	/**
	 * Returns true if the values are the same value, false otherwise.
	 * @param a
	 * @param b
	 * @returns
	 */
	export const is = (a: unknown, b: unknown) => (a === b ? true : safeEquals(a, b));
}

export = Object;
