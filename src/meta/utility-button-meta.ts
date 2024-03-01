//!native
//!optimize 2

import { HttpService, Lighting, Workspace } from "@rbxts/services";
const PhysicsSettings = settings().GetService("PhysicsSettings" as never) as PhysicsSettings;
const Selection = game.GetService("Selection");

import ScriptServices from "utilities/button-utilities/script-services";
import UtilityButton from "./utility-button";

import promiseAll from "promises/promise-plus/promise-all";
import clearAllEffects from "utilities/button-utilities/clear-all-effects";
import deleteEmptyFolders from "utilities/button-utilities/delete-empty/delete-empty-folders";
import deleteEmptyModels from "utilities/button-utilities/delete-empty/delete-empty-models";
import getOrCreate from "utilities/button-utilities/get-or-create";
import isSourceContainer from "utilities/button-utilities/is-source-container";
import organizeByBrickColor from "utilities/button-utilities/organize-by-colors/organize-by-brickcolor";
import organizeByColor3 from "utilities/button-utilities/organize-by-colors/organize-by-color3";
import promiseSource from "utilities/button-utilities/promise-source";
import searchForDuplicates from "utilities/button-utilities/search-for-duplicates";
import smoothNoOutlines from "utilities/button-utilities/smooth-no-outlines";
import weldTool from "utilities/button-utilities/weld-tool";

interface Metadata {
	/**
	 * What will be executed when the button is clicked.
	 */
	readonly callback: () => void;

	/**
	 * The ChangeHistoryService name.
	 */
	readonly name: string;

	/**
	 * Whether or not to record the action in the ChangeHistoryService.
	 */
	readonly shouldRecord: boolean;

	/**
	 * The text on the button.
	 */
	readonly text: string;

	/**
	 * The text to show on the tooltip.
	 */
	readonly tooltip: string;
}

export const UtilityButtonMeta: { [utilityButton in UtilityButton]: Metadata } = {
	[UtilityButton.CreateAspectRatio]: {
		callback: () => {
			for (const object of Selection.Get())
				if (object.IsA("GuiBase2d")) {
					const uiAspectRatioConstraint = new Instance("UIAspectRatioConstraint");
					uiAspectRatioConstraint.AspectRatio = object.AbsoluteSize.X / object.AbsoluteSize.Y;
					uiAspectRatioConstraint.Parent = object;
				}
		},

		name: "CreateAspectRatio",
		shouldRecord: true,
		text: "Create Aspect Ratio",
		tooltip: "Creates an aspect ratio constraint for all selected GuiBase2ds.",
	},

	[UtilityButton.CreatePrimaryPart]: {
		callback: () => {
			const newSelection = new Array<Instance>();
			let length = 0;

			for (const object of Selection.Get()) {
				if (object.IsA("Model")) {
					if (object.PrimaryPart !== undefined) {
						warn(object.GetFullName(), "already has a PrimaryPart.");
						continue;
					}

					const primaryPart = new Instance("Part");
					[primaryPart.CFrame, primaryPart.Size] = object.GetBoundingBox();
					primaryPart.Anchored = true;
					primaryPart.CanCollide = false;
					primaryPart.Name = "Root";
					primaryPart.Transparency = 1;
					primaryPart.Parent = object;
					object.PrimaryPart = primaryPart;

					newSelection[length++] = primaryPart;
				}
			}

			Selection.Set(newSelection);
		},

		name: "CreatePrimaryParts",
		shouldRecord: true,
		text: "Create PrimaryParts",
		tooltip: "Creates a PrimaryPart for all selected models.",
	},

	[UtilityButton.DeleteEmptyFolders]: {
		callback: () => {
			const currentSelection = Selection.Get();
			// delete under Workspace
			if (currentSelection.isEmpty()) deleteEmptyFolders(Workspace, false);
			else for (const object of currentSelection) deleteEmptyFolders(object, false);
		},

		name: "DeleteEmptyFolders",
		shouldRecord: true,
		text: "Delete Empty Folders",
		tooltip: "Deletes all folders with no children.",
	},

	[UtilityButton.DeleteEmptyFoldersSafe]: {
		callback: () => {
			const currentSelection = Selection.Get();
			// delete under Workspace
			if (currentSelection.isEmpty()) deleteEmptyFolders(Workspace, true);
			else for (const object of currentSelection) deleteEmptyFolders(object, true);
		},

		name: "DeleteEmptyFoldersSafe",
		shouldRecord: true,
		text: "Delete Empty Folders (Safe)",
		tooltip: "Moves all folders with no children to a folder in Workspace.",
	},

	[UtilityButton.DeleteEmptyModels]: {
		callback: () => {
			const currentSelection = Selection.Get();
			// delete under Workspace
			if (currentSelection.isEmpty()) deleteEmptyModels(Workspace, false);
			else for (const object of currentSelection) deleteEmptyModels(object, false);
		},

		name: "DeleteEmptyModels",
		shouldRecord: true,
		text: "Delete Empty Models",
		tooltip: "Deletes all models with no children.",
	},

	[UtilityButton.DeleteEmptyModelsSafe]: {
		callback: () => {
			const currentSelection = Selection.Get();
			// delete under Workspace
			if (currentSelection.isEmpty()) deleteEmptyModels(Workspace, true);
			else for (const object of currentSelection) deleteEmptyModels(object, true);
		},

		name: "DeleteEmptyModelsSafe",
		shouldRecord: true,
		text: "Delete Empty Models (Safe)",
		tooltip: "Moves all models with no children to a folder in Workspace.",
	},

	[UtilityButton.EasyExport]: {
		callback: () => {
			for (const object of Selection.Get())
				if (object.IsA("Folder") || object.IsA("Model")) organizeByBrickColor(object);
		},

		name: "EasyExport",
		shouldRecord: true,
		text: "Easy Export",
		tooltip: "Sorts all parts in a given model by BrickColor for an easier way to export as a Mesh.",
	},

	[UtilityButton.EasyExportColor3]: {
		callback: () => {
			for (const object of Selection.Get())
				if (object.IsA("Folder") || object.IsA("Model")) organizeByColor3(object);
		},

		name: "EasyExportColor3",
		shouldRecord: true,
		text: "Easy Export Color3",
		tooltip: "Sorts all parts in a given model by Color3 for an easier way to export as a Mesh.",
	},

	[UtilityButton.FixTabs]: {
		callback: () => {
			const promises = new Array<Promise<void>>();
			let length = 0;

			for (const service of ScriptServices)
				for (const descendant of service.GetDescendants())
					if (isSourceContainer(descendant))
						promises[length++] = promiseSource(descendant).then((source) => {
							descendant.Source = source.gsub("    ", "\t")[0];
						});

			promiseAll(promises).expect();
		},

		name: "FixTabs",
		shouldRecord: true,
		text: "Fix Tabs",
		tooltip: "Converts all quad spaces into tabs in all scripts.",
	},

	[UtilityButton.LockAllBaseParts]: {
		callback: () => {
			for (const descendant of Workspace.GetDescendants())
				if (descendant.IsA("BasePart") && !descendant.IsA("Terrain")) descendant.Locked = true;
		},

		name: "LockAllBaseParts",
		shouldRecord: true,
		text: "Lock all BaseParts",
		tooltip: "Locks all BaseParts in the place.",
	},

	[UtilityButton.RemoveDuplicates]: {
		callback: () => {
			const currentSelection = Selection.Get();
			print(
				"Deleted",
				currentSelection.size() === 0
					? searchForDuplicates(Workspace.GetDescendants(), 0)
					: searchForDuplicates(currentSelection, 0),
				"duplicate instances.",
			);
		},

		name: "RemoveDuplicates",
		shouldRecord: true,
		text: "Remove Duplicates",
		tooltip: "Removes all duplicate BaseParts from the place.",
	},

	[UtilityButton.RemoveSpec]: {
		callback: () => {
			let totalDeleted = 0;
			for (const service of ScriptServices)
				for (const descendant of service.GetDescendants())
					if (isSourceContainer(descendant) && descendant.Name.match("%.spec$")[0] !== undefined) {
						descendant.Parent = undefined;
						totalDeleted += 1;
					}

			if (totalDeleted > 0) print("Deleted", totalDeleted, ".spec files.");
		},

		name: "RemoveSpec",
		shouldRecord: true,
		text: "Remove Spec",
		tooltip: "Removes all .spec files from the place.",
	},

	[UtilityButton.SelectParentOfSelection]: {
		callback: () => {
			const selection = Selection.Get().mapFiltered((object) => object.Parent);
			Selection.Set(selection);
		},

		name: "SelectParentOfSelection",
		shouldRecord: false,
		text: "Select Selection Parents",
		tooltip: "Selects the parent of the current selection.",
	},

	[UtilityButton.SetupGame]: {
		callback: () => {
			clearAllEffects();

			const baseplate = getOrCreate(Workspace, "Part", "Baseplate");
			baseplate.Anchored = true;
			baseplate.Color = Color3.fromRGB(136, 179, 88);
			baseplate.Locked = true;
			baseplate.Material = Enum.Material.Grass;
			baseplate.Position = Vector3.zero;
			baseplate.Size = new Vector3(512, 1, 512);
			smoothNoOutlines(baseplate);

			Selection.Set([HttpService]);

			const spawnLocation = getOrCreate(Workspace, "SpawnLocation");
			spawnLocation.Anchored = true;
			spawnLocation.Duration = 0;
			spawnLocation.Position = Vector3.yAxis;
			spawnLocation.Size = new Vector3(12, 1, 12);
			smoothNoOutlines(spawnLocation);

			const decal = getOrCreate(spawnLocation, "Decal");
			decal.Face = Enum.NormalId.Top;
			decal.Texture = "rbxasset://textures/SpawnLocation.png";
			decal.Parent = spawnLocation;

			Lighting.Ambient = Color3.fromRGB(41, 41, 45);
			Lighting.Brightness = 4;
			Lighting.ColorShift_Bottom = Color3.fromRGB(93, 111, 153);
			Lighting.ColorShift_Top = Color3.fromRGB(91, 60, 0);
			Lighting.OutdoorAmbient = Color3.fromRGB(138, 161, 168);
			Lighting.GeographicLatitude = 35;
			Lighting.FogColor = Color3.fromRGB(173, 205, 253);
			Lighting.FogEnd = 4000;
			Lighting.FogStart = 500;

			const skybox = getOrCreate(Lighting, "Sky");
			skybox.MoonTextureId = "rbxassetid://1345054856";
			skybox.SkyboxBk = "rbxassetid://591058823";
			skybox.SkyboxDn = "rbxassetid://591059876";
			skybox.SkyboxFt = "rbxassetid://591058104";
			skybox.SkyboxLf = "rbxassetid://591057861";
			skybox.SkyboxRt = "rbxassetid://591057625";
			skybox.SkyboxUp = "rbxassetid://591059642";
			skybox.SunTextureId = "rbxassetid://1345009717";

			const atmosphere = getOrCreate(Lighting, "Atmosphere");
			atmosphere.Color = Color3.fromRGB(199, 170, 107);
			atmosphere.Decay = Color3.fromRGB(92, 60, 13);
			atmosphere.Density = 0.35;
			atmosphere.Glare = 0;
			atmosphere.Haze = 0;
			atmosphere.Offset = 0;

			const depthOfFieldEffect = new Instance("DepthOfFieldEffect");
			depthOfFieldEffect.FarIntensity = 0.171;
			depthOfFieldEffect.InFocusRadius = 34.305;
			depthOfFieldEffect.NearIntensity = 0.475;
			depthOfFieldEffect.Parent = Lighting;

			const bloomEffect = new Instance("BloomEffect");
			bloomEffect.Intensity = 0.4;
			bloomEffect.Size = 24;
			bloomEffect.Threshold = 0.95;
			bloomEffect.Parent = Lighting;

			const blurEffect = new Instance("BlurEffect");
			blurEffect.Size = 3;
			blurEffect.Parent = Lighting;

			const colorCorrectionEffect = new Instance("ColorCorrectionEffect");
			colorCorrectionEffect.Brightness = 0.03;
			colorCorrectionEffect.Contrast = 0.03;
			colorCorrectionEffect.Saturation = 0.3;
			colorCorrectionEffect.Parent = Lighting;

			const sunRaysEffect = new Instance("SunRaysEffect");
			sunRaysEffect.Intensity = 0.624;
			sunRaysEffect.Spread = 1;
			sunRaysEffect.Parent = Lighting;
		},

		name: "SetupGame",
		shouldRecord: true,
		text: "Setup Game",
		tooltip: "Create a Baseplate, SpawnLocation, and various Lighting effects, then select the HttpService.",
	},

	[UtilityButton.ShowDecompositionGeometry]: {
		callback: () => (PhysicsSettings.ShowDecompositionGeometry = !PhysicsSettings.ShowDecompositionGeometry),
		name: "ShowDecompositionGeometry",
		shouldRecord: false,
		text: "Show Decomposition Geometry",
		tooltip: "Toggles the visibility of the decomposition geometry.",
	},

	[UtilityButton.ValleyLighting]: {
		callback: () => {
			clearAllEffects();

			Lighting.Ambient = Color3.fromRGB(45, 45, 45);
			Lighting.Brightness = 6;
			Lighting.ClockTime = 9;
			Lighting.ColorShift_Bottom = Color3.fromRGB(130, 112, 42);
			Lighting.ColorShift_Top = Color3.fromRGB(255, 138, 35);
			Lighting.GeographicLatitude = 41.733;
			Lighting.OutdoorAmbient = Color3.fromRGB(127, 127, 127);
			Lighting.ShadowSoftness = 1;

			const skybox = getOrCreate(Lighting, "Sky");
			skybox.CelestialBodiesShown = false;
			skybox.MoonTextureId = "rbxasset://sky/moon.jpg";
			skybox.SkyboxBk = "rbxassetid://225469345";
			skybox.SkyboxDn = "rbxassetid://225469349";
			skybox.SkyboxFt = "rbxassetid://225469359";
			skybox.SkyboxLf = "rbxassetid://225469364";
			skybox.SkyboxRt = "rbxassetid://225469372";
			skybox.SkyboxUp = "rbxassetid://225469380";
			skybox.SunTextureId = "rbxasset://sky/sun.jpg";
			skybox.Parent = Lighting;

			const atmosphere = getOrCreate(Lighting, "Atmosphere");
			atmosphere.Density = 0.395;
			atmosphere.Offset = 0;
			atmosphere.Color = Color3.fromRGB(199, 170, 107);
			atmosphere.Decay = Color3.fromRGB(92, 60, 13);
			atmosphere.Glare = 0;
			atmosphere.Haze = 0;

			const depthOfFieldEffect = new Instance("DepthOfFieldEffect");
			depthOfFieldEffect.FarIntensity = 0.171;
			depthOfFieldEffect.FocusDistance = 0.05;
			depthOfFieldEffect.InFocusRadius = 34.305;
			depthOfFieldEffect.NearIntensity = 0.475;
			depthOfFieldEffect.Parent = Lighting;

			const bloomEffect = new Instance("BloomEffect");
			bloomEffect.Intensity = 0.15;
			bloomEffect.Size = 24;
			bloomEffect.Threshold = 0.97;
			bloomEffect.Parent = Lighting;

			const blurEffect = new Instance("BlurEffect");
			blurEffect.Size = 3;
			blurEffect.Parent = Lighting;

			const colorCorrectionEffect = new Instance("ColorCorrectionEffect");
			colorCorrectionEffect.Brightness = 0.03;
			colorCorrectionEffect.Contrast = 0.03;
			colorCorrectionEffect.Saturation = 0.3;
			colorCorrectionEffect.Parent = Lighting;

			const sunRaysEffect = new Instance("SunRaysEffect");
			sunRaysEffect.Intensity = 0.13;
			sunRaysEffect.Spread = 0.4;
			sunRaysEffect.Parent = Lighting;
		},

		name: "ValleyLighting",
		shouldRecord: true,
		text: "Set Valley Lighting",
		tooltip: "Sets the lighting to the valley theme.",
	},

	[UtilityButton.WeldConstraintTools]: {
		callback: () => {
			for (const object of Selection.Get()) if (object.IsA("Tool")) weldTool(object);
		},

		name: "WeldConstraintTools",
		shouldRecord: true,
		text: "WeldConstraint Tools",
		tooltip: "Welds all the BaseParts in the selected Tools using a WeldConstraint.",
	},
};

export default UtilityButtonMeta;
