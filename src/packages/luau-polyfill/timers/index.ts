//!native
//!optimize 2
/* eslint-disable unicorn/prefer-export-from */

import { IntervalTask, clearInterval, setInterval } from "./interval";
import { TimerTask, clearTimeout, setTimeout } from "./timer";

namespace Timers {
	export const ClearInterval = clearInterval;
	export const SetInterval = setInterval;

	export const ClearTimeout = clearTimeout;
	export const SetTimeout = setTimeout;

	export type Interval = IntervalTask;
	export type Timer = TimerTask;
}

export = Timers;
