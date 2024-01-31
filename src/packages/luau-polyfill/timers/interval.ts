//!native
//!optimize 2

import CreateSymbol from "./create-symbol";

const Status = CreateSymbol();

enum TaskStatus {
	SCHEDULED = 1,
	CANCELLED = 3,
}

export type IntervalTask = { [status: typeof Status]: TaskStatus };

/**
 * Schedules repeated execution of `callback` every `delay` milliseconds.
 *
 * When `delay` is larger than `2147483647` or less than `1`, the `delay` will be
 * set to `1`. Non-integer delays are truncated to an integer.
 *
 * If `callback` is not a function, a `TypeError` will be thrown.
 *
 * @param callback The function to call when the timer elapses.
 * @param [delay=0] The number of milliseconds to wait before calling the `callback`.
 * @param intervalArguments Optional arguments to pass when the `callback` is called.
 * @return for use with {@link clearInterval}
 */
export function setInterval<TArguments extends Array<unknown>>(
	callback: (...intervalArguments: TArguments) => void,
	delay = 0,
	...intervalArguments: TArguments
): IntervalTask {
	const timeout: IntervalTask = {
		[Status]: TaskStatus.SCHEDULED,
	};

	const intervalTime = delay / 1000;
	function delayFunction() {
		task.delay(intervalTime, () => {
			if (timeout[Status] === TaskStatus.SCHEDULED) {
				callback(...intervalArguments);
				delayFunction();
			}
		});
	}

	delayFunction();
	return timeout;
}

/**
 * Cancels a `Interval` object created by `setInterval()`.
 * @param timeout A `Interval` object as returned by {@link setInterval}.
 */
export function clearInterval(timeout: IntervalTask) {
	if (timeout === undefined) return;
	if (timeout[Status] === TaskStatus.SCHEDULED) timeout[Status] = TaskStatus.CANCELLED;
}
