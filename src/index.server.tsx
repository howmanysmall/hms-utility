//!native
//!optimize 2
/// <reference types="@rbxts/types/plugin" />
import App from "components/app";
import PluginApp from "components/plugin-app";
import Roact from "@rbxts/roact";

const toolbar = plugin.CreateToolbar("HowManyPlugins");
const button = toolbar.CreateButton("HmsUtility", "Toggles the utility widget.", "");
button.ClickableWhenViewportHidden = true;

const dockWidget = plugin.CreateDockWidgetPluginGui(
	"HmsWidget",
	new DockWidgetPluginGuiInfo(Enum.InitialDockState.Float, false, false, 300, 200, 300, 200),
);

function main() {
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

	button.Click.Connect(() => (dockWidget.Enabled = !dockWidget.Enabled));
	plugin.Unloading.Connect(() => Roact.unmount(tree));

	return 0;
}

main();
