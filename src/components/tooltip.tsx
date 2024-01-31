//!native
//!optimize 2
/* eslint-disable unicorn/no-array-callback-reference */

import Roact, { useBinding, useCallback, useEffect, useRef, useState } from "@rbxts/roact";

import useTheme from "hooks/use-theme";
import BasicShadow from "./basic-shadow";

import { console } from "packages/luau-polyfill";
import { promiseTextSize } from "promises/text-service-promise";
import { offset, offsetFromVector2, oneOffset, oneScale } from "utilities/udim2";
import { fromVector3XYNoCache } from "utilities/vector2";

const BUFFER = 3;

const OFFSET_DOWN = 18;
const OFFSET_LEFT = 2;
const OFFSET_RIGHT = 3;
const OFFSET_UP = 2;

const TEXT_PADDING_BOTTOM = 2 + 3;
const TEXT_PADDING_SIDES = 3 + 3;
const TEXT_PADDING_TOP = 1 + 3;
const TEXT_SIZE = 14;

const FOR_FULL_SIZE = new Vector2(TEXT_PADDING_SIDES * 2, TEXT_PADDING_BOTTOM + TEXT_PADDING_TOP);

export interface TooltipProperties {
	readonly disabled: boolean;
	readonly hoverDelay: number;
	readonly maxWidth: number;
	readonly text: string;
}

export const Tooltip: Roact.FunctionComponent<Partial<TooltipProperties>> = ({
	disabled,
	hoverDelay = 0.4,
	maxWidth = 200,
	text = "Tooltip.defaultProps.Text",
}) => {
	const [display, setDisplay] = useState(false);
	const [textSize, setTextSize] = useBinding(Vector2.zero);

	const displayPosition = useRef<Vector2 | undefined>();
	const displayThread = useRef<thread | undefined>();

	const reference = useRef<Frame>();
	const { border, fontFaces, mainText, tooltip } = useTheme();

	const backgroundColor3 = tooltip.default;
	const borderColor3 = border.default;
	const textColor3 = mainText.default;

	const cancel = useCallback(() => {
		if (display) setDisplay(false);
		if (displayThread.current) {
			task.cancel(displayThread.current);
			displayPosition.current = undefined;
			displayThread.current = undefined;
		}
	}, [display]);

	const onInputBeganChanged = useCallback(
		(_: Frame, inputObject: InputObject) => {
			if (!disabled && inputObject.UserInputType === Enum.UserInputType.MouseMovement) {
				cancel();
				displayPosition.current = fromVector3XYNoCache(inputObject.Position);
				displayThread.current = task.delay(hoverDelay, () => setDisplay(true));
			}
		},
		[cancel, disabled, hoverDelay],
	);

	const onInputEnded = useCallback(
		(_: Frame, inputObject: InputObject) => {
			if (inputObject.UserInputType === Enum.UserInputType.MouseMovement) cancel();
		},
		[cancel],
	);

	useEffect(() => {
		if (displayThread.current) task.cancel(displayThread.current);
	}, []);

	useEffect(() => {
		const frameSize = new Vector2(maxWidth - TEXT_PADDING_SIDES * 2, math.huge);
		const promise = promiseTextSize(text, TEXT_SIZE, fontFaces.default, frameSize)
			.then(setTextSize)
			.catch((exception) => console.warn(`PromiseTextSize call failed - ${exception}`));

		return () => promise.cancel();
	}, [maxWidth, setTextSize, text, fontFaces]);

	const fullSize = textSize.map((value) => value.add(FOR_FULL_SIZE));
	const anchorPoint = fullSize.map((value) => {
		let anchorPoint = Vector2.zero;
		if (display) {
			const target = reference.current?.FindFirstAncestorWhichIsA("LayerCollector");
			if (target) {
				const mousePosition = displayPosition.current;
				if (mousePosition) {
					const spaceRight = target.AbsoluteSize.X - mousePosition.X - OFFSET_RIGHT;
					const spaceLeft = mousePosition.X - OFFSET_LEFT;
					if (spaceRight < value.X + BUFFER && spaceLeft > spaceRight)
						anchorPoint = new Vector2(1, anchorPoint.Y);

					const spaceBelow = target.AbsoluteSize.Y - mousePosition.Y - OFFSET_DOWN;
					const spaceAbove = mousePosition.Y - OFFSET_UP;
					if (spaceBelow < value.Y + BUFFER && spaceAbove > spaceBelow)
						anchorPoint = new Vector2(anchorPoint.X, 1);
				}
			}
		}

		return anchorPoint;
	});

	const tooltipSize = fullSize.map(offsetFromVector2);
	const tooltipPosition = fullSize
		.map((value) => {
			let offset = Vector2.zero;
			if (display) {
				const target = reference.current?.FindFirstAncestorWhichIsA("LayerCollector");
				if (target) {
					const mousePosition = displayPosition.current;
					if (mousePosition) {
						const spaceRight = target.AbsoluteSize.X - mousePosition.X - OFFSET_RIGHT;
						const spaceLeft = mousePosition.X - OFFSET_LEFT;
						if (spaceRight < value.X + BUFFER && spaceLeft > spaceRight)
							offset = new Vector2(-OFFSET_LEFT, offset.Y);

						const spaceBelow = target.AbsoluteSize.Y - mousePosition.Y - OFFSET_DOWN;
						const spaceAbove = mousePosition.Y - OFFSET_UP;
						if (spaceBelow < value.Y + BUFFER && spaceAbove > spaceBelow)
							offset = new Vector2(offset.X, -OFFSET_UP);
					}
				}
			}

			return offset;
		})
		.map((value) => offsetFromVector2(displayPosition.current!.add(value)));

	let dropShadow: Roact.Element | undefined;
	let target: LayerCollector | undefined;
	if (display) {
		target = reference.current?.FindFirstAncestorWhichIsA("LayerCollector");
		if (target)
			dropShadow = (
				<BasicShadow
					key="Shadow"
					position={offset(4)}
					radius={5}
					size={new UDim2(1, 1, 1, 1)}
					transparency={0.96}
				>
					<BasicShadow
						key="Shadow"
						position={oneOffset}
						radius={4}
						size={new UDim2(1, -2, 1, -2)}
						transparency={0.88}
					>
						<BasicShadow
							key="Shadow"
							position={oneOffset}
							radius={3}
							size={new UDim2(1, -2, 1, -2)}
							transparency={0.8}
						>
							<BasicShadow
								key="Shadow"
								position={oneOffset}
								radius={2}
								size={new UDim2(1, -2, 1, -2)}
								transparency={0.77}
							/>
						</BasicShadow>
					</BasicShadow>
				</BasicShadow>
			);
	}

	return (
		<frame
			BackgroundTransparency={1}
			Size={oneScale}
			ref={reference}
			Change={{ AbsolutePosition: cancel }}
			Event={{
				InputBegan: onInputBeganChanged,
				InputChanged: onInputBeganChanged,
				InputEnded: onInputEnded,
			}}
		>
			{target ? (
				<Roact.Portal key="Portal" target={target}>
					<frame
						AnchorPoint={anchorPoint}
						BackgroundTransparency={1}
						Position={tooltipPosition}
						Size={tooltipSize}
						ZIndex={2 ** 31 - 1}
						key="Tooltip"
					>
						<textlabel
							BackgroundColor3={backgroundColor3}
							BorderColor3={borderColor3}
							FontFace={fontFaces.default}
							Size={oneScale}
							Text={text}
							TextColor3={textColor3}
							TextSize={14}
							TextWrapped
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Top}
							key="Label"
						>
							<uipadding
								PaddingBottom={new UDim(0, TEXT_PADDING_BOTTOM)}
								PaddingLeft={new UDim(0, TEXT_PADDING_SIDES)}
								PaddingRight={new UDim(0, TEXT_PADDING_SIDES)}
								PaddingTop={new UDim(0, TEXT_PADDING_TOP)}
								key="UIPadding"
							/>
						</textlabel>

						{dropShadow}
					</frame>
				</Roact.Portal>
			) : undefined}
		</frame>
	);
};

export default Roact.memo(Tooltip);
