//!native
//!nonstrict
//!optimize 2
/* eslint-disable @typescript-eslint/no-explicit-any */

import Symbol from "packages/symbol";

namespace Object {
	function safeEquals(a: unknown, b: unknown) {
		if (a === 0 && b === 0) return 1 / a === 1 / b;
		// biome-ignore lint/suspicious/noSelfCompare: NaN check.
		if (a !== a && b !== b) return true;
		return a === b;
	}

	export const None = Symbol("None");

	/**
	 * Returns true if the values are the same value, false otherwise.
	 * @param a
	 * @param b
	 * @returns
	 */
	export function is(a: unknown, b: unknown) {
		return a === b ? a !== 0 || 1 / a === 1 / (b as typeof a) : safeEquals(a, b);
	}

	export function assign<A, B>(target: A, source: B): A & B;
	export function assign<A, B, C>(target: A, source1: B, source2: C): A & B & C;
	export function assign<A, B, C, D>(target: A, source1: B, source2: C, source3: D): A & B & C & D;
	export function assign<A, B, C, D, E>(target: A, source1: B, source2: C, source3: D, source4: E): A & B & C & D & E;
	export function assign<A, B, C, D, E, F>(
		target: A,
		source1: B,
		source2: C,
		source3: D,
		source4: E,
		source5: F,
	): A & B & C & D & E & F;
	export function assign(target: object, ...sources: Array<any>): any;
	export function assign(target: object, ...sources: Array<any>) {
		for (const source of sources)
			for (const [key, value] of pairs(source))
				if ((value as never) === None) delete (target as Record<string, unknown>)[key as string];
				else (target as Record<string, unknown>)[key as string] = value;

		return target;
	}

	/**
	 * Returns an array of values of the enumerable properties of an object
	 * @param object Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
	 */
	export function values<T>(object: ReadonlyArray<T>): Array<NonNullable<T>>;
	export function values<T>(object: ReadonlySet<T>): Array<true>;
	export function values<K, V>(object: ReadonlyMap<K, V>): Array<NonNullable<V>>;
	export function values<T extends object>(
		object: T,
	): keyof T extends never ? Array<unknown> : Array<NonNullable<T[keyof T]>>;
	export function values(object: object) {
		const result = new Array<defined>();
		let length = 0;
		for (const [, value] of pairs(object)) result[length++] = value;
		return result;
	}

	/**
	 * Returns the names of the enumerable properties and methods of an object.
	 * @param object Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
	 */
	export function keys<T>(object: ReadonlyArray<T>): Array<number>;
	export function keys<T>(object: ReadonlySet<T>): Array<T>;
	export function keys<K, V>(object: ReadonlyMap<K, V>): Array<K>;
	export function keys<T extends object>(object: T): keyof T extends never ? Array<unknown> : Array<keyof T>;
	export function keys(object: object) {
		const result = new Array<defined>();
		let length = 0;
		for (const [key] of pairs(object)) result[length++] = key as defined;
		return result;
	}
}

export = Object;
