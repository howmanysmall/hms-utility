import { clearInterval, setInterval, IntervalTask } from "./interval";
import { clearTimeout, setTimeout, TimerTask } from "./timer";

namespace Timers {
	export const ClearInterval = clearInterval;
	export const SetInterval = setInterval;

	export const ClearTimeout = clearTimeout;
	export const SetTimeout = setTimeout;

	export type Interval = IntervalTask;
	export type Timer = TimerTask;
}

export = Timers;
