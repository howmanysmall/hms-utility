//!native
//!optimize 2
import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import type { Storybook } from "types/flipbook";

const HmsUtilityStorybook: Storybook = {
	name: "HmsUtility",
	react: Roact,
	reactRoblox: ReactRoblox,
	storyRoots: [script.Parent!.FindFirstChild("stories")!],
};

export = HmsUtilityStorybook;
