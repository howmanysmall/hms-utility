//!native
//!optimize 2

import Roact, { useEffect } from "@rbxts/roact";
import { useErrorBoundary } from "packages/react-error-boundary";

export const FallbackResetBoundary: Roact.FunctionComponent = () => {
	const { resetBoundary } = useErrorBoundary();
	useEffect(() => {
		resetBoundary();
	}, [resetBoundary]);

	return undefined!;
};

export default Roact.memo(FallbackResetBoundary);
