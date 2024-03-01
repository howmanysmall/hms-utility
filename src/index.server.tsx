//!native
//!optimize 2

import React from "@rbxts/react";
import App from "components/app";
import PluginApp from "components/plugin-app";
import createSharedToolbar, { type SharedToolbarSettings } from "utilities/create-shared-toolbar";

const dockWidget = plugin.CreateDockWidgetPluginGui(
	"HmsWidget",
	new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 300, 200, 300, 200),
);

const sharedToolbarSettings: SharedToolbarSettings = {
	buttonIcon: "",
	buttonName: "HmsUtility",
	buttonTooltip: "Toggles the utility widget.",
	combinerName: "HowManyPluginsToolbar",
	onClicked: () => (dockWidget.Enabled = !dockWidget.Enabled),

	toolbarName: "HowManyPlugins",
};
createSharedToolbar(plugin, sharedToolbarSettings);

function main() {
	const button = sharedToolbarSettings.button!;
	button.ClickableWhenViewportHidden = true;

	dockWidget.Name = "HmsWidget";
	dockWidget.Title = "HmsWidget";
	dockWidget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;

	const tree = Roact.mount(
		<App>
			<PluginApp key="PluginApp" />
		</App>,
		dockWidget,
		"Main",
	);

	plugin.Unloading.Once(() => Roact.unmount(tree));

	return 0;
}

main();
