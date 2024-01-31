//!native
//!optimize 2

import Roact from "@rbxts/roact";

export interface ErrorBoundaryContextType {
	readonly didCatch: boolean;
	readonly error: unknown;
	readonly resetErrorBoundary: Callback;
}

export const ErrorBoundaryContext = Roact.createContext<ErrorBoundaryContextType | undefined>(undefined);
export default ErrorBoundaryContext;
