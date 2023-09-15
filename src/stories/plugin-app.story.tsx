import Roact from "@rbxts/roact";
import * as ReactRoblox from "@rbxts/react-roblox";
import type { ReactStory } from "types/flipbook";
import App from "components/app";
import PluginApp from "components/plugin-app";
import { center } from "utilities/vector2";
import { centerScale } from "utilities/udim2";

const PluginAppStory: ReactStory = {
	name: "PluginApp.story",
	react: Roact,
	reactRoblox: ReactRoblox,
	story: (
		<App useStrictMode>
			<frame
				AnchorPoint={center}
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(442, 424)}
				Position={centerScale}
				key="ContainerFrame"
			>
				<PluginApp key="PluginApp" />
			</frame>
		</App>
	),

	summary: `This is the component that renders the plugin.`,
};

export = PluginAppStory;