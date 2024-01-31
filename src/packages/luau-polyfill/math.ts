//!native
//!optimize 2

import { isFinite, Number } from "./number";

namespace Math {
	export const E = math.exp(1);
	export const LN2 = math.log(2);
	export const LN10 = math.log(10);
	export const LOG2E = math.log(E, 2);
	export const LOG10E = math.log(E, 10);
	export const PI = math.pi;
	export const SQRT1_2 = math.sqrt(1 / 2);
	export const SQRT2 = math.sqrt(2);

	const USE_FAST_CLZ32 = true;

	export function cbrt(value: number) {
		return math.sign(value) * math.abs(value) ** (1 / 3);
	}

	export const clz32 = USE_FAST_CLZ32
		? bit32.countlz
		: (value: number) => {
				const as32Bit = value >>> 0;
				if (as32Bit === 0) return 32;
				return 31 - math.floor(math.log(as32Bit) / LN2);
			};

	export function expm1(value: number) {
		return math.exp(value) - 1;
	}

	const EPSILON = 2 ** -52;
	const EPSILON32 = 2 ** -23;
	const MAX32 = 2 ** 127 * (2 - EPSILON32);
	const MIN32 = 2 ** -126;

	const roundTiesToEven = (value: number) => value + 1 / EPSILON - 1 / EPSILON;

	export function fround(value: number) {
		const absValue = math.abs(value);
		const signValue = math.sign(value);
		if (absValue < MIN32) return signValue * roundTiesToEven(absValue / MIN32 / EPSILON32) * MIN32 * EPSILON32;

		const valueA = (1 + EPSILON32 / EPSILON) * absValue;
		const result = valueA - (valueA - absValue);
		if (result > MAX32 || result !== result) return signValue * math.huge;

		return signValue * result;
	}

	export function hypot(...values: ReadonlyArray<number>) {
		const aLength = values.size();
		let sum = 0;
		let index = 0;
		let lastArgument = 0;
		let argument, div;
		while (index < aLength) {
			argument = math.abs(values[index++]);
			if (lastArgument < argument) {
				div = lastArgument / argument;
				sum = sum * div * div + 1;
				lastArgument = argument;
			} else if (argument > 0) {
				div = argument / lastArgument;
				sum += div * div;
			} else sum += argument;
		}

		return lastArgument === math.huge ? math.huge : lastArgument * math.sqrt(sum);
	}

	const UINT16 = 65_535;
	export function imul(value0: number, value1: number) {
		const newValue0 = UINT16 & value0;
		const newValue1 = UINT16 & value1;
		return (
			0 |
			(newValue0 * newValue1 +
				((((UINT16 & (value0 >>> 16)) * newValue1 + newValue0 * (UINT16 & (value1 >>> 16))) << 16) >>> 0))
		);
	}

	export function log1p(value: number) {
		return value > -1e-8 && value < 1e-8 ? value - (value * value) / 2 : math.log(1 + value);
	}

	export function log2(value: number) {
		return math.log(value, 2);
	}

	export function round(value: number) {
		const newValue = Number(value);
		if (!isFinite(newValue) || math.floor(newValue) === newValue) return newValue;
		if (newValue < 0.5 && newValue > 0) return 0;
		if (newValue < 0 && newValue >= -0.5) return -0;
		return newValue - math.floor(newValue) >= 0.5 ? math.ceil(newValue) : math.floor(newValue);
	}

	export function trunc(value: number) {
		return value > 0 ? math.floor(value) : math.ceil(value);
	}
}

export = Math;
