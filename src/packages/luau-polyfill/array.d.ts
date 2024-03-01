// TODO: finish the rest of the array polyfill

import { t } from "@rbxts/t";

declare namespace Array {
	/**
	 * Combines two or more arrays.
	 * @param items Additional items to add to the end of source.
	 */
	export function concat<T>(this: void, source: Array<T>, ...items: Array<Array<T>>): Array<T>;
	export function concat<T>(
		this: void,
		source: ReadonlyArray<T>,
		...items: ReadonlyArray<ReadonlyArray<T>>
	): ReadonlyArray<T>;

	/**
	 * Combines two or more arrays.
	 * @param items Additional items to add to the end of source.
	 */
	export function concat<T>(this: void, source: Array<T>, ...items: Array<Array<T> | T>): Array<T>;

	export function isArray<T>(this: void, argument: unknown): argument is Array<T>;
	export function isArrayValidator<T>(this: void, argument: unknown, validate: t.check<T>): argument is Array<T>;

	/**
	 * Reverses the elements in an Array.
	 */
	export function reverse<T>(this: void, array: Array<T>): Array<T>;

	/**
	 * Returns a section of an array.
	 * @param start The beginning of the specified portion of the array.
	 * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
	 */
	export function slice<T>(this: void, array: Array<T>, start?: number, end?: number): Array<T>;

	/**
	 * Performs an array sort operation, returning the same array. Uses numbers like the default Array.prototype.sort.
	 * @param array
	 * @param compareFunction
	 */
	export function sort<T>(this: void, array: Array<T>, compareFunction?: (a: T, b: T) => number): Array<T>;

	/**
	 * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
	 * @param start The zero-based location in the array from which to start removing elements.
	 * @param deleteCount The number of elements to remove.
	 */
	export function splice<T>(this: void, array: Array<T>, start: number, deleteCount?: number): Array<T>;

	/**
	 * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
	 * @param start The zero-based location in the array from which to start removing elements.
	 * @param deleteCount The number of elements to remove.
	 * @param items Elements to insert into the array in place of the deleted elements.
	 */
	export function splice<T>(
		this: void,
		array: Array<T>,
		start: number,
		deleteCount: number,
		...items: Array<T>
	): Array<T>;

	/**
	 * Determines whether the specified callback function returns true for any element of an array.
	 * @param predicate A function that accepts up to three arguments. The some method calls
	 * the predicate function for each element in the array until the predicate returns a value
	 * which is coercible to the Boolean value true, or until the end of the array.
	 * @param thisArg An object to which the this keyword can refer in the predicate function.
	 * If thisArg is omitted, undefined is used as the this value.
	 */
	export function some<T>(
		this: void,
		array: Array<T>,
		predicate: (value: T, index: number, array: Array<T>) => unknown,
		thisArgument?: any,
	): boolean;
}

export = Array;
