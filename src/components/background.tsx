import Roact from "@rbxts/roact";
import useTheme from "hooks/use-theme";
import { oneScale } from "utilities/udim2";
import type { BindingOrValue } from "types/generic";

export interface BackgroundProperties {
	anchorPoint?: BindingOrValue<Vector2>;
	layoutOrder?: BindingOrValue<number>;
	position?: BindingOrValue<UDim2>;
	size?: BindingOrValue<UDim2>;
	zIndex?: BindingOrValue<number>;
}

export const Background: Roact.FunctionComponent<BackgroundProperties> = ({
	anchorPoint,
	children,
	layoutOrder,
	position,
	size = oneScale,
	zIndex,
}) => {
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
};

export default Roact.memo(Background);