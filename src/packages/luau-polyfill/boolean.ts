//!native
//!nonstrict
//!optimize 2

import { isNaN } from "./number";

namespace Boolean {
	export function toJSBoolean(value: unknown): boolean {
		return !!(value as boolean) && value !== 0 && value !== "" && !isNaN(value);
	}
}

export = Boolean;
