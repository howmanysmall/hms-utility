//!native
//!optimize 2

import Roact, { useMemo } from "@rbxts/roact";
import useTheme from "hooks/use-theme";
import { oneScale } from "utilities/udim2";

export interface AutomaticScrollingFrameProperties {
	readonly includePadding?: boolean;
	readonly itemCount: number;
	readonly itemHeight: number;
	readonly renderItem: (index: number) => Roact.Element;
}

export const AutomaticScrollingFrame: Roact.FunctionComponent<AutomaticScrollingFrameProperties> = ({
	itemCount,
	itemHeight,
	renderItem,
}) => {
	const { themeName } = useTheme();

	const children = useMemo(() => {
		const children = new Array<Roact.Element>(itemCount);

		for (const index of $range(1, itemCount))
			children[index - 1] = (
				<frame
					BackgroundTransparency={1}
					LayoutOrder={index}
					Size={new UDim2(1, 0, 0, itemHeight)}
					key={`Item-${index}`}
				>
					{renderItem(index)}
				</frame>
			);

		return children;
	}, [itemCount, itemHeight, renderItem]);

	return (
		<scrollingframe
			AutomaticCanvasSize={Enum.AutomaticSize.Y}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			BottomImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			CanvasSize={UDim2.fromOffset(0, itemCount * itemHeight)}
			MidImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			ScrollBarImageColor3={themeName === "Dark" ? Color3.fromRGB(85, 85, 85) : Color3.fromRGB(245, 245, 245)}
			ScrollBarThickness={12}
			Size={oneScale}
			TopImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
				key="UIListLayout"
			/>

			{children}
		</scrollingframe>
	);
};

export default Roact.memo(AutomaticScrollingFrame);
