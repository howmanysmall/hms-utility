//!native
//!optimize 2
import Roact from "@rbxts/roact";

export interface ErrorBoundaryContextType {
	didCatch: boolean;
	error: unknown;
	resetErrorBoundary: Callback;
}

export const ErrorBoundaryContext = Roact.createContext<ErrorBoundaryContextType | undefined>(undefined);
export default ErrorBoundaryContext;
