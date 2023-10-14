//!native
//!optimize 2
import Roact, { useCallback, useState } from "@rbxts/roact";
import useTheme from "hooks/use-theme";
import { oneScale } from "utilities/udim2";
import type { BindingOrValue } from "types/generic";

export interface VirtualScrollerProperties {
	readonly layoutOrder?: BindingOrValue<number>;

	readonly includePadding?: boolean;
	readonly itemCount: number;
	readonly itemHeight: number;

	readonly renderItem: (index: number) => Roact.Element;
}

export const VirtualScroller: Roact.FunctionComponent<VirtualScrollerProperties> = ({
	layoutOrder,
	includePadding,
	itemCount,
	itemHeight,
	renderItem,
}) => {
	const { border, themeName } = useTheme();

	const [absoluteWindowSize, setAbsoluteWindowSize] = useState(Vector2.zero);
	const [canvasPosition, setCanvasPosition] = useState(Vector2.zero);

	const onAbsoluteWindowSizeChange = useCallback(
		(rbx: ScrollingFrame) => setAbsoluteWindowSize(rbx.AbsoluteWindowSize),
		[],
	);

	const onCanvasPositionChange = useCallback(
		(rbx: ScrollingFrame) => {
			const position = rbx.CanvasPosition;
			if (canvasPosition.sub(position).Magnitude > itemHeight) setCanvasPosition(position);
		},
		[canvasPosition, itemHeight],
	);

	let minIndex = 0;
	let maxIndex = -1;
	if (itemCount > 0) {
		minIndex = math.clamp(1 + math.floor(canvasPosition.Y / itemHeight), 1, itemCount);
		maxIndex = math.clamp(math.ceil((canvasPosition.Y + absoluteWindowSize.Y) / itemHeight), 1, itemCount);
	}

	const padding = (minIndex - 1) * itemHeight;
	const children = new Array<Roact.Element>(maxIndex - minIndex + 4);
	for (const index of $range(minIndex, maxIndex)) {
		children[index - minIndex] = (
			<frame
				BackgroundTransparency={1}
				LayoutOrder={index}
				Size={new UDim2(1, 0, 0, itemHeight)}
				key={`Item-${index}`}
			>
				{renderItem(index)}
			</frame>
		);
	}

	children.push(
		<uilistlayout
			HorizontalAlignment={Enum.HorizontalAlignment.Center}
			FillDirection={Enum.FillDirection.Vertical}
			SortOrder={Enum.SortOrder.LayoutOrder}
			key="UIListLayout"
		/>,

		<frame
			BackgroundTransparency={1}
			LayoutOrder={minIndex - 1}
			Size={new UDim2(1, 0, 0, padding)}
			key="PadOffset"
		/>,
	);

	if (includePadding)
		children.push(
			<uipadding
				PaddingBottom={new UDim(0, 16)}
				PaddingLeft={new UDim(0, 16)}
				PaddingRight={new UDim(0, 16)}
				PaddingTop={new UDim(0, 16)}
				key="UIPadding"
			/>,
		);

	return (
		<scrollingframe
			BackgroundTransparency={1}
			BorderColor3={border.default}
			BorderSizePixel={0}
			BottomImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			CanvasSize={UDim2.fromOffset(0, itemCount * itemHeight)}
			LayoutOrder={layoutOrder}
			MidImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			ScrollBarImageColor3={themeName === "Dark" ? Color3.fromRGB(85, 85, 85) : Color3.fromRGB(245, 245, 245)}
			ScrollBarThickness={12}
			Size={oneScale}
			TopImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
			Change={{
				AbsoluteWindowSize: onAbsoluteWindowSizeChange,
				CanvasPosition: onCanvasPositionChange,
			}}
		>
			{children}
		</scrollingframe>
	);
};

export default Roact.memo(VirtualScroller);
