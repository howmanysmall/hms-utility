import Roact from "@rbxts/roact";
import ErrorBoundary from "packages/react-error-boundary/error-boundary";
import FallbackResetBoundary from "./fallback-reset-boundary";

export interface AppProperties {
	/**
	 * Whether or not to use strict mode.
	 *
	 * This should really be off in production, as
	 * it does double renders.
	 */
	useStrictMode?: boolean;
}

export const App: Roact.FunctionComponent<AppProperties> = ({ children, useStrictMode }) => (
	<ErrorBoundary FallbackComponent={FallbackResetBoundary} onError={warn} onReset={() => print("Called reset.")}>
		{useStrictMode ? <Roact.StrictMode key="StrictMode">{children}</Roact.StrictMode> : <>{children}</>}
	</ErrorBoundary>
);

export default Roact.memo(App);
