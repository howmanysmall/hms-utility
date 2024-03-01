//!native
//!optimize 2

import React, { useEffect } from "@rbxts/react";
import { useErrorBoundary } from "packages/react-error-boundary";

export function FallbackResetBoundaryNoMemo(): React.Element {
	const { resetBoundary } = useErrorBoundary();
	useEffect(() => {
		resetBoundary();
	}, [resetBoundary]);

	return <></>;
}

export const FallbackResetBoundary = React.memo(FallbackResetBoundaryNoMemo);
FallbackResetBoundary.displayName = "FallbackResetBoundary";
export default FallbackResetBoundary;
