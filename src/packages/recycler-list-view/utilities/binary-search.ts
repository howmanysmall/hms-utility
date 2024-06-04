//!native
//!optimize 2

import CustomError from "classes/custom-error";

export interface ValueAndIndex {
	index: number;
	value: number;
}

export function findClosestHigherValueIndex(
	size: number,
	targetValue: number,
	valueExtractor: (index: number) => number,
): number {
	let low = 0;
	let high = size - 1;
	if (high < 0)
		throw new CustomError({
			message: "The collection cannot be empty",
			type: "InvalidStateException",
		});

	let middle = (low + high).idiv(2);
	let lastValue = 0;
	let absoluteLastDifference = math.abs(valueExtractor(middle) - targetValue);
	if (absoluteLastDifference === 0) return middle;

	let result = middle;
	let difference = 0;
	let absoluteDifference = 0;

	while (low <= high) {
		middle = (low + high).idiv(2);
		lastValue = valueExtractor(middle);

		difference = lastValue - targetValue;
		absoluteDifference = math.abs(difference);

		if (difference >= 0 && absoluteDifference < absoluteLastDifference) {
			absoluteLastDifference = absoluteDifference;
			result = middle;
		}

		if (targetValue < lastValue) high = middle - 1;
		else if (targetValue > lastValue) low = middle + 1;
		else return middle;
	}

	return result;
}

export function findClosestValueToTarget(values: Array<number>, target: number): ValueAndIndex {
	let low = 0;
	let high = values.size() - 1;
	let middle = (low + high).idiv(2);
	let middleValue = values[middle];
	let lastMiddleValue = middleValue + 1;

	while (low <= high && middleValue !== lastMiddleValue) {
		if (middleValue === target) {
			break;
		}

		if (middleValue < target) low = middle;
		else if (middleValue > target) high = middle;

		middle = (low + high).idiv(2);
		lastMiddleValue = middleValue;
		middleValue = values[middle];
	}

	return {
		index: middle,
		value: middleValue,
	};
}

export function findValueSmallerThanTarget(values: Array<number>, target: number): ValueAndIndex | undefined {
	const high = values.size() - 1;
	if (target >= values[high])
		return {
			index: high,
			value: values[high],
		};
	if (target < values[0]) return undefined;

	const { index, value } = findClosestValueToTarget(values, target);
	return value <= target
		? { index, value }
		: {
				index: index - 1,
				value: values[index - 1],
			};
}

export function findValueLargerThanTarget(values: Array<number>, target: number): ValueAndIndex | undefined {
	if (target < values[0])
		return {
			index: 0,
			value: values[0],
		};

	if (target > values[values.size() - 1]) return undefined;

	const { index, value } = findClosestValueToTarget(values, target);
	return value >= target
		? { index, value }
		: {
				index: index + 1,
				value: values[index + 1],
			};
}

export function findIndexOf(array: Array<number>, value: number) {
	let jndex = 0;
	let length = array.size();
	let index = 0;
	while (jndex < length) {
		index = (length + jndex - 1) >> 1;
		if (value > array[index]) jndex = index + 1;
		else if (value < array[index]) length = index;
		else return index;
	}

	return -1;
}
