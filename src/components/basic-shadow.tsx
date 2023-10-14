//!native
//!optimize 2
import Roact from "@rbxts/roact";
import useTheme from "hooks/use-theme";

export interface BasicShadowProperties {
	readonly position: UDim2;
	readonly radius: number;
	readonly size: UDim2;
	readonly transparency: number;
}

export const BasicShadow: Roact.FunctionComponent<BasicShadowProperties> = ({
	position,
	radius,
	size,
	transparency,
	children,
}) => {
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
};

export default Roact.memo(BasicShadow);
