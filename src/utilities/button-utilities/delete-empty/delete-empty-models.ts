//!native
//!optimize 2

import { LocalizationService, Workspace } from "@rbxts/services";

export default function deleteEmptyModels(parent: Instance, saveToWorld = false) {
	const emptyModels = new Set<Model>();
	for (const descendant of parent.GetDescendants())
		if (descendant.ClassName === "Model" && descendant.GetChildren().isEmpty())
			emptyModels.add(descendant as Model);

	if (saveToWorld) {
		const emptyModelsFolder = new Instance("Folder");

		for (const model of emptyModels) {
			model.SetAttribute("LastPath", model.Parent?.GetFullName() ?? "FAILED_TO_GET");
			model.Parent = emptyModelsFolder;
		}

		emptyModelsFolder.Name = `EmptyModels-${DateTime.now().FormatLocalTime(
			"MM.DD.YY@HH.mm.ss",
			LocalizationService.RobloxLocaleId,
		)}`;
		emptyModelsFolder.Parent = Workspace;
	} else for (const model of emptyModels) model.Parent = undefined;
}
