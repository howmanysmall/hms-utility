//!native
//!optimize 2

const CoreGui = game.GetService("CoreGui");

export interface SharedToolbarSettings {
	button?: PluginToolbarButton;
	readonly buttonIcon: string;
	readonly buttonName: string;
	readonly buttonTooltip: string;
	readonly combinerName: string;
	readonly toolbarName: string;

	readonly onClicked: () => void;
}

function getOrCreate<T extends keyof CreatableInstances>(
	parent: Instance,
	className: T,
	name: string,
): LuaTuple<[object: CreatableInstances[T], wasCreated: boolean]> {
	for (const child of parent.GetChildren())
		if (child.IsA(className) && child.Name === name) return $tuple(child, false);

	const object = new Instance(className);
	object.Name = name;
	object.Parent = parent;
	return $tuple(object, true);
}

export default function createSharedToolbar(plugin: Plugin, settings: SharedToolbarSettings) {
	const [combiner] = getOrCreate(CoreGui, "ObjectValue", settings.combinerName);
	const [owner] = getOrCreate(combiner, "ObjectValue", "Owner");

	let buttonConnection: RBXScriptConnection | undefined;

	function createButton(toolbar: PluginToolbar) {
		buttonConnection?.Disconnect();

		const [buttonReference, wasCreated] = getOrCreate(combiner, "ObjectValue", settings.buttonName);
		if (wasCreated) {
			buttonReference.Value = toolbar.CreateButton(
				settings.buttonName,
				settings.buttonTooltip,
				settings.buttonIcon,
			);
			buttonReference.Value.Name = `${plugin.Name}_${settings.buttonName}`;
		}

		const currentButton = buttonReference.Value;
		if (!currentButton?.IsA("PluginToolbarButton"))
			throw `Invalid button type ${currentButton?.ClassName ?? "nil"}`;

		buttonConnection = currentButton.Click.Connect(settings.onClicked);
		settings.button = currentButton;
	}

	{
		let toolbar = combiner.Value as PluginToolbar | undefined;
		if (!toolbar || !toolbar.IsA("PluginToolbar")) {
			toolbar = plugin.CreateToolbar(settings.toolbarName);
			combiner.Value = toolbar;
			owner.Value = plugin;
		}
		createButton(toolbar);
	}

	const onOwnerChanged = owner.Changed.Connect(() => {
		task.delay(0.5, () => {
			if (!owner.Value) {
				const toolbar = plugin.CreateToolbar(settings.toolbarName);
				toolbar.Name = `${plugin.Name}_Toolbar`;
				combiner.Value = toolbar;
				owner.Value = plugin;
			} else if (combiner.Value) createButton(combiner.Value as PluginToolbar);
		});
	});

	const onUnloading = plugin.Unloading.Once(() => {
		onUnloading.Disconnect();
		onOwnerChanged.Disconnect();
		buttonConnection?.Disconnect();

		if (owner.Value === plugin) {
			for (const child of combiner.GetChildren()) if (child !== owner) child.Destroy();
			combiner.Value = undefined;
			owner.Value = undefined;
		}
	});
}
