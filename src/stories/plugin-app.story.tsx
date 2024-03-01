//!native
//!optimize 2

import React from "@rbxts/react";
import * as ReactRoblox from "@rbxts/react-roblox";
import App from "components/app";
import PluginApp from "components/plugin-app";
import type { ReactStory } from "types/flipbook";
import { centerScale } from "utilities/udim2";
import { center } from "utilities/vector2";

const PluginAppStory: ReactStory = {
	name: "PluginApp.story",
	react: React,
	reactRoblox: ReactRoblox,
	story: (
		<App useStrictMode>
			<frame
				AnchorPoint={center}
				BackgroundTransparency={1}
				Position={centerScale}
				Size={UDim2.fromOffset(442, 424)}
				key="ContainerFrame"
			>
				<PluginApp key="PluginApp" />
			</frame>
		</App>
	),

	summary: "This is the component that renders the plugin.",
};

export = PluginAppStory;
