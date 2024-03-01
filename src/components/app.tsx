//!native
//!optimize 2

import React, { StrictMode } from "@rbxts/react";
import { ErrorBoundary } from "packages/react-error-boundary";
import FallbackResetBoundary from "./fallback-reset-boundary";

export interface AppProperties extends React.PropsWithChildren {
	/**
	 * Whether or not to use strict mode.
	 *
	 * This should really be off in production, as
	 * it does double renders.
	 */
	readonly useStrictMode?: boolean;
}

export function AppNoMemo({ children, useStrictMode }: AppProperties): React.Element {
	const child = (
		<ErrorBoundary
			FallbackComponent={FallbackResetBoundary}
			key="ErrorBoundary"
			onError={warn}
			onReset={() => print("Called reset.")}
		>
			{children}
		</ErrorBoundary>
	);

	return useStrictMode ? <StrictMode>{child}</StrictMode> : child;
}

export const App = React.memo(AppNoMemo);
App.displayName = "App";
export default App;
