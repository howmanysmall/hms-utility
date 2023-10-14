//!native
//!optimize 2
import Roact from "@rbxts/roact";
import type { Error } from "packages/luau-polyfill";

type FallbackRender = (properties: FallbackProperties) => unknown;

/**
 * Props for fallback components.
 */
export interface FallbackProperties {
	error: Error;

	/**
	 * Resets the error boundary and calls `onReset` if provided. This is useful for reverting state or retrying the render.
	 */
	resetErrorBoundary: Callback;
}

interface ErrorBoundarySharedProperties {
	onError?: (error: Error, info: { componentStack: string }) => void;
	onReset?: (
		details:
			| { reason: "imperative-api"; args: Array<unknown> }
			| { reason: "keys"; prev?: Array<unknown>; next?: Array<unknown> },
	) => void;

	resetKeys?: Array<unknown>;
}

/**
 * One of 3 types of fallback that can be provided to an error boundary.
 */
export interface ErrorBoundaryPropertiesWithComponent extends ErrorBoundarySharedProperties {
	FallbackComponent: Roact.FunctionComponent;
}

/**
 * One of 3 types of fallback that can be provided to an error boundary.
 *
 * [Render prop](https://react.dev/reference/react/Children#calling-a-render-prop-to-customize-rendering) function that returns the fallback UI.
 * This is helpful if you want to handle errors differently based on the error.
 *
 * See [ErrorIn1SecondFallbackComponent](https://github.com/chriscerie/react-error-boundary/blob/main/stories/ErrorIn1SecondFallbackRender.story.lua) for a full example.
 *
 * Render prop functions are normal functions and are not React components. Attempting to use hooks in them will error!
 */
export interface ErrorBoundaryPropertiesWithRender extends ErrorBoundarySharedProperties {
	fallbackRender: FallbackRender;
}

export interface ErrorBoundaryPropertiesWithFallback extends ErrorBoundarySharedProperties {
	fallback: Roact.Element;
}

export type ErrorBoundaryProperties =
	| ErrorBoundaryPropertiesWithFallback
	| ErrorBoundaryPropertiesWithRender
	| ErrorBoundaryPropertiesWithComponent;
