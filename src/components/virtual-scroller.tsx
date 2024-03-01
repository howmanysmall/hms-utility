//!native
//!optimize 2

import React, { useCallback, useState } from "@rbxts/react";
import useTheme from "hooks/use-theme";
import type { BindingOrValue } from "types/generic";
import { oneScale } from "utilities/udim2";

export interface VirtualScrollerProperties {
	readonly includePadding?: boolean;

	readonly itemCount: number;
	readonly itemHeight: number;
	readonly layoutOrder?: BindingOrValue<number>;

	readonly renderItem: (index: number) => React.Element;
}

export function VirtualScrollerNoMemo({
	includePadding,
	itemCount,
	itemHeight,
	layoutOrder,
	renderItem,
}: VirtualScrollerProperties): React.Element {
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
		minIndex = math.clamp(1 + canvasPosition.Y.idiv(itemHeight), 1, itemCount);
		maxIndex = math.clamp((canvasPosition.Y + absoluteWindowSize.Y).idiv(itemHeight) + 1, 1, itemCount);
	}

	const padding = (minIndex - 1) * itemHeight;
	const children = new Array<React.Element>(maxIndex - minIndex + 1);
	for (const index of $range(minIndex, maxIndex))
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

	return (
		<scrollingframe
			BackgroundTransparency={1}
			BorderColor3={border.default}
			BorderSizePixel={0}
			BottomImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			CanvasSize={UDim2.fromOffset(0, itemCount * itemHeight)}
			Change={{
				AbsoluteWindowSize: onAbsoluteWindowSizeChange,
				CanvasPosition: onCanvasPositionChange,
			}}
			LayoutOrder={layoutOrder}
			MidImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			ScrollBarImageColor3={themeName === "Dark" ? Color3.fromRGB(85, 85, 85) : Color3.fromRGB(245, 245, 245)}
			ScrollBarThickness={12}
			Size={oneScale}
			TopImage="rbxasset://textures/ui/Scroll/scroll-middle.png"
			VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
				key="UIListLayout"
			/>

			<frame
				BackgroundTransparency={1}
				LayoutOrder={minIndex - 1}
				Size={new UDim2(1, 0, 0, padding)}
				key="PadOffset"
			/>

			{includePadding && (
				<uipadding
					PaddingBottom={new UDim(0, 16)}
					PaddingLeft={new UDim(0, 16)}
					PaddingRight={new UDim(0, 16)}
					PaddingTop={new UDim(0, 16)}
					key="UIPadding"
				/>
			)}

			{children}
		</scrollingframe>
	);
}

export const VirtualScroller = React.memo(VirtualScrollerNoMemo);
VirtualScroller.displayName = "VirtualScroller";
export default VirtualScroller;
