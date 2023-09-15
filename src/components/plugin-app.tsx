import Roact, { useCallback, useMemo } from "@rbxts/roact";

import AutomaticScrollingFrame from "./automatic-scrolling-frame";
import Background from "./background";
import Button from "./button";
import Tooltip from "./tooltip";
import VirtualScroller from "./virtual-scroller";

import UtilityButton from "meta/utility-button";
import UtilityButtonMeta from "meta/utility-button-meta";

import inSortedOrder from "utilities/in-sorted-order";
import tryLogToHistory from "utilities/try-log-to-history";
import useTheme from "hooks/use-theme";

function sort(a: keyof typeof UtilityButton, b: keyof typeof UtilityButton) {
	return UtilityButton[a] < UtilityButton[b];
}

const PADDING_SCALE = 0.02;
const BUTTON_HEIGHT = 36;
const BUTTON_SIZE = new UDim2(1, 0, 0, BUTTON_HEIGHT);
const USE_VIRTUAL_SCROLLER = true;

export const PluginApp: Roact.FunctionComponent = () => {
	const { fontFaces, mainText } = useTheme();

	const onActivatedFunctions = useMemo(() => {
		const functions = {} as Record<UtilityButton, () => void>;

		for (const [, utilityButton] of pairs(UtilityButton)) {
			const { callback, name, shouldRecord, text } = UtilityButtonMeta[utilityButton];
			functions[utilityButton] = shouldRecord ? tryLogToHistory(callback, name, text) : callback;
		}

		return functions;
	}, []);

	const [buttons, length] = useMemo(() => {
		const buttons = new Array<Roact.Element>();
		let length = 0;

		for (const [name, utilityButton] of inSortedOrder(UtilityButton, sort)) {
			const onActivated = onActivatedFunctions[utilityButton];
			if (!onActivated) {
				warn(`Missing onActivated for ${name}?`);
				continue;
			}

			const { text, tooltip } = UtilityButtonMeta[utilityButton];
			buttons[length++] = (
				<Button
					key={`Button-${name}`}
					nativeProperties={{
						LayoutOrder: length,
						Size: BUTTON_SIZE,
						Text: text,
					}}
					onActivated={onActivated}
				>
					<Tooltip key="Tooltip" text={tooltip} />
				</Button>
			);
		}

		return $tuple(buttons, length);
	}, [onActivatedFunctions]);

	const renderItem = useCallback((index: number) => buttons[index - 1], [buttons]);

	return (
		<Background>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(PADDING_SCALE, 0)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				key="UIListLayout"
			/>

			<textlabel
				BackgroundTransparency={1}
				FontFace={fontFaces.heavy}
				Size={UDim2.fromScale(0.75, 0.125)}
				Text="HowManyUtilities"
				TextColor3={mainText.default}
				TextScaled
				key="TitleLabel"
			/>

			<frame
				BackgroundTransparency={1}
				LayoutOrder={1}
				Size={UDim2.fromScale(0.85, 0.75)}
				key="ButtonFrameContainer"
			>
				{USE_VIRTUAL_SCROLLER ? (
					<VirtualScroller
						includePadding={false}
						itemCount={length}
						itemHeight={BUTTON_HEIGHT}
						key="ButtonFrame"
						renderItem={renderItem}
					/>
				) : (
					<AutomaticScrollingFrame
						itemCount={length}
						itemHeight={BUTTON_HEIGHT}
						key="ButtonFrame"
						renderItem={renderItem}
					/>
				)}
			</frame>
		</Background>
	);
};

export default Roact.memo(PluginApp);
