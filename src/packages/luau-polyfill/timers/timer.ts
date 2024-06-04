//!native
//!nonstrict
//!optimize 2
import CreateSymbol from "./create-symbol";

const Status = CreateSymbol();

enum TaskStatus {
	CANCELLED = 3,
	DONE = 2,
	SCHEDULED = 1,
}

export type TimerTask = { [status: typeof Status]: TaskStatus };

/**
 * Schedules execution of a one-time `callback` after `delay` milliseconds.
 *
 * The `callback` will likely not be invoked in precisely `delay` milliseconds.
 * Node.js makes no guarantees about the exact timing of when callbacks will fire,
 * nor of their ordering. The callback will be called as close as possible to the
 * time specified.
 *
 * When `delay` is larger than `2147483647` or less than `1`, the `delay` will be set to `1`. Non-integer delays are truncated to an integer.
 *
 * If `callback` is not a function, a `TypeError` will be thrown.
 *
 * @param callback The function to call when the timer elapses.
 * @param [delay=0] The number of milliseconds to wait before calling the `callback`.
 * @param timeoutArguments Optional arguments to pass when the `callback` is called.
 * @return for use with {@link clearTimeout}
 */
export function setTimeout<TArguments extends Array<unknown>>(
	callback: (...timeoutArguments: TArguments) => void,
	delay = 0,
	...timeoutArguments: TArguments
): TimerTask {
	const timeout: TimerTask = {
		[Status]: TaskStatus.SCHEDULED,
	};

	const intervalTime = delay / 1000;
	task.delay(intervalTime, () => {
		if (timeout[Status] === TaskStatus.SCHEDULED) {
			callback(...timeoutArguments);
			timeout[Status] = TaskStatus.DONE;
		}
	});

	return timeout;
}

/**
 * Cancels a `Timeout` object created by `setTimeout()`.
 * @param timeout A `Timeout` object as returned by {@link setTimeout}.
 */
export function clearTimeout(timeout: TimerTask) {
	if (timeout === undefined) return;
	if (timeout[Status] === TaskStatus.SCHEDULED) timeout[Status] = TaskStatus.CANCELLED;
}
