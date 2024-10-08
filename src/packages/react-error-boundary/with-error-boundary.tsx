//!native
//!optimize 2

import Roact from "@rbxts/roact";
import ErrorBoundary from "./error-boundary.d";
import { ErrorBoundaryProperties } from "./types";

/**
 *  This is a higher-order component that makes it easy to add an error boundary to an existing component. See
 *  [ErrorIn1SecondHOC](https://github.com/chriscerie/react-error-boundary/blob/main/stories/ErrorIn1SecondHOC.story.lua) for a full example.
 *
 * @param Component
 * @param errorBoundaryProps
 */
export function withErrorBoundary<Properties extends object>(
	Component: Roact.ComponentType<Properties>,
	errorBoundaryProperties: ErrorBoundaryProperties,
) {
	const Wrapped = Roact.forwardRef((properties: Properties, reference) => {
		const componentProperties = { ...properties, ref: reference };

		return (
			<ErrorBoundary {...(errorBoundaryProperties as any)}>
				<Component {...componentProperties} key="component" />
			</ErrorBoundary>
		);
	});

	return Wrapped;
}

export default withErrorBoundary;
