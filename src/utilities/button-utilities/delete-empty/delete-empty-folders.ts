//!native
//!optimize 2

import { LocalizationService, Workspace } from "@rbxts/services";

export default function deleteEmptyFolders(parent: Instance, saveToWorld = false) {
	const emptyFolders = new Set<Folder>();
	for (const descendant of parent.GetDescendants())
		if (descendant.IsA("Folder") && descendant.GetChildren().isEmpty()) emptyFolders.add(descendant);

	if (saveToWorld) {
		const emptyFoldersFolder = new Instance("Folder");

		for (const folder of emptyFolders) {
			folder.SetAttribute("LastPath", folder.Parent?.GetFullName() ?? "FAILED_TO_GET");
			folder.Parent = emptyFoldersFolder;
		}

		emptyFoldersFolder.Name = `EmptyFolders-${DateTime.now().FormatLocalTime(
			"MM.DD.YY@HH.mm.ss",
			LocalizationService.RobloxLocaleId,
		)}`;
		emptyFoldersFolder.Parent = Workspace;
	} else for (const folder of emptyFolders) folder.Parent = undefined;
}
