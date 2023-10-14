//!native
//!optimize 2
import type { AnimationConfigs } from "@rbxts/rbx-react-spring";

export const BaseTheme = {
	fontFaces: {
		default: new Font("rbxasset://fonts/families/GothamSSm.json"),
		medium: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Medium),
		bold: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Bold),
		heavy: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Heavy),
	},

	textSize: 14,
	springConfigs: {
		noOvershoot117ms: identity<AnimationConfigs>({
			friction: 12,
			mass: 0.1,
			tension: 500,
		}),
	},
};

export default BaseTheme;
