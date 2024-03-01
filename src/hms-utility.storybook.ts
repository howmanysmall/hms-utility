//!native
//!optimize 2

import React from "@rbxts/react";
import * as ReactRoblox from "@rbxts/react-roblox";
import type { Storybook } from "types/flipbook";

const HmsUtilityStorybook: Storybook = {
	name: "HmsUtility",
	react: React,
	reactRoblox: ReactRoblox,
	storyRoots: [script.Parent!.FindFirstChild("stories")!],
};

export = HmsUtilityStorybook;
