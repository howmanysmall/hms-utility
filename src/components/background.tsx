//!native
//!optimize 2

import React from "@rbxts/react";
import useTheme from "hooks/use-theme";
import type { BindingOrValue } from "types/generic";
import { oneScale } from "utilities/udim2";

export interface BackgroundProperties extends React.PropsWithChildren {
	readonly anchorPoint?: BindingOrValue<Vector2>;
	readonly layoutOrder?: BindingOrValue<number>;
	readonly position?: BindingOrValue<UDim2>;
	readonly size?: BindingOrValue<UDim2>;
	readonly zIndex?: BindingOrValue<number>;
}

export function BackgroundNoMemo({
	anchorPoint,
	children,
	layoutOrder,
	position,
	size = oneScale,
	zIndex,
}: BackgroundProperties): React.Element {
	const { mainBackground } = useTheme();
	return (
		<frame
			AnchorPoint={anchorPoint}
			BackgroundColor3={mainBackground.default}
			BorderSizePixel={0}
			LayoutOrder={layoutOrder}
			Position={position}
			Size={size}
			ZIndex={zIndex}
		>
			{children}
		</frame>
	);
}

export const Background = React.memo(BackgroundNoMemo);
Background.displayName = "Background";
export default Background;
