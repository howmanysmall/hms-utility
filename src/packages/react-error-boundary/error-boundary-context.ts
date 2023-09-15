import Roact from "@rbxts/roact";
import { console } from "packages/luau-polyfill";
console;

export interface ErrorBoundaryContextType {
	didCatch: boolean;
	error: unknown;
	resetErrorBoundary: Callback;
}

export const ErrorBoundaryContext = Roact.createContext<ErrorBoundaryContextType | undefined>(undefined);
export default ErrorBoundaryContext;
