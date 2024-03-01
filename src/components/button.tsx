//!native
//!optimize 2

import React, { useCallback, type InstanceProps } from "@rbxts/react";
import { useSpring } from "@rbxts/react-spring";
import useBasicInputEvents from "hooks/use-basic-input-events";
import useTheme from "hooks/use-theme";
import { oneScale } from "utilities/udim2";

export interface ButtonProperties extends React.PropsWithChildren {
	readonly disabled?: boolean;
	readonly nativeProperties: InstanceProps<TextButton>;
	readonly onActivated?: () => void;
	readonly selected?: boolean;
}

export function ButtonNoMemo({
	children,
	disabled = false,
	nativeProperties,
	onActivated = () => {},
	selected = false,
}: ButtonProperties): React.Element {
	const { button, buttonBorder, buttonText, fontFaces, springConfigs, textSize } = useTheme();
	const { hovered, onInputBegan, onInputEnded, pressed, setHovered, setPressed } =
		useBasicInputEvents<TextButton>(!disabled);

	const buttonOnActivated = useCallback(() => {
		if (!disabled) {
			setHovered(false);
			setPressed(false);
			onActivated();
		}
	}, [disabled, onActivated, setHovered, setPressed]);

	const modifier = disabled
		? "disabled"
		: selected
			? "selected"
			: pressed
				? "pressed"
				: hovered
					? "hover"
					: "default";

	const { backgroundColor3, borderColor3, textColor3 } = useSpring(
		{
			backgroundColor3: button[modifier],
			borderColor3: buttonBorder[modifier],
			config: springConfigs.noOvershoot117ms,
			textColor3: buttonText[modifier],
		},
		[button, buttonBorder, buttonText, modifier],
	);

	return (
		<textbutton
			Size={oneScale}
			Text="Button.Text"
			TextSize={textSize}
			{...nativeProperties}
			AutoButtonColor={false}
			BackgroundColor3={backgroundColor3}
			BorderColor3={borderColor3}
			BorderMode={Enum.BorderMode.Inset}
			Event={{
				Activated: buttonOnActivated,
				InputBegan: onInputBegan,
				InputEnded: onInputEnded,
			}}
			FontFace={fontFaces.default}
			TextColor3={textColor3}
		>
			{children}
		</textbutton>
	);
}

export const Button = React.memo(ButtonNoMemo);
Button.displayName = "Button";
export default Button;
