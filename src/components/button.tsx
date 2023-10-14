//!native
//!optimize 2
import Roact, { useCallback } from "@rbxts/roact";
import useBasicInputEvents from "hooks/use-basic-input-events";
import useTheme from "hooks/use-theme";
import { useSpring } from "@rbxts/rbx-react-spring";
import { oneScale } from "utilities/udim2";

export interface ButtonProperties {
	readonly disabled?: boolean;
	readonly nativeProperties: Roact.JsxInstance<TextButton>;
	readonly selected?: boolean;
	readonly onActivated?: () => void;
}

export const Button: Roact.FunctionComponent<ButtonProperties> = ({
	children,
	disabled = false,
	nativeProperties,
	selected = false,
	onActivated = () => {},
}) => {
	const { button, buttonBorder, buttonText, fontFaces, springConfigs, textSize } = useTheme();
	const { hovered, pressed, onInputBegan, onInputEnded, setHovered, setPressed } = useBasicInputEvents<TextButton>(
		!disabled,
	);

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
			config: springConfigs.noOvershoot117ms,
			backgroundColor3: button[modifier],
			borderColor3: buttonBorder[modifier],
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
			FontFace={fontFaces.default}
			TextColor3={textColor3}
			Event={{
				Activated: buttonOnActivated,
				InputBegan: onInputBegan,
				InputEnded: onInputEnded,
			}}
		>
			{children}
		</textbutton>
	);
};

export default Roact.memo(Button);
