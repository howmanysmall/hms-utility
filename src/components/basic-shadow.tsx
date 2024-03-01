//!native
//!optimize 2

import React from "@rbxts/react";
import useTheme from "hooks/use-theme";

export interface BasicShadowProperties extends React.PropsWithChildren {
	readonly position: UDim2;
	readonly radius: number;
	readonly size: UDim2;
	readonly transparency: number;
}

export function BasicShadowNoMemo({
	children,
	position,
	radius,
	size,
	transparency,
}: BasicShadowProperties): React.Element {
	const { dropShadow } = useTheme();

	return (
		<frame
			BackgroundColor3={dropShadow.default}
			BackgroundTransparency={transparency}
			BorderSizePixel={0}
			Position={position}
			Size={size}
			ZIndex={0}
		>
			<uicorner CornerRadius={new UDim(0, radius)} key="UICorner" />
			{children}
		</frame>
	);
}

export const BasicShadow = React.memo(BasicShadowNoMemo);
BasicShadow.displayName = "BasicShadow";
export default BasicShadow;
