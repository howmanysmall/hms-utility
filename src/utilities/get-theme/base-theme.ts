//!native
//!optimize 2

import type { AnimationConfigs } from "@rbxts/react-spring";

export const BaseTheme = {
	fontFaces: {
		bold: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Bold),
		default: new Font("rbxasset://fonts/families/GothamSSm.json"),
		heavy: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Heavy),
		medium: new Font("rbxasset://fonts/families/GothamSSm.json", Enum.FontWeight.Medium),
	},

	springConfigs: {
		noOvershoot117ms: identity<AnimationConfigs>({
			friction: 12,
			mass: 0.1,
			tension: 500,
		}),
	},
	textSize: 14,
};

export default BaseTheme;
