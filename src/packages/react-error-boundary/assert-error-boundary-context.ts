//!native
//!optimize 2

import { t } from "@rbxts/t";
import type { ErrorBoundaryContextType } from "./error-boundary-context";

const isErrorBoundaryContext = t.interface({
	didCatch: t.boolean,
	resetErrorBoundary: t.callback,
}) as t.check<ErrorBoundaryContextType>;

export function assertErrorBoundaryContext(value: unknown): ErrorBoundaryContextType {
	assert(isErrorBoundaryContext(value), "ErrorBoundaryContext not found");
	return value;
}

export default assertErrorBoundaryContext;
