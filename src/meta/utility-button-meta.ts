import { Workspace, HttpService, Lighting } from "@rbxts/services";
const PhysicsSettings = settings().GetService("PhysicsSettings" as never) as PhysicsSettings;
const Selection = game.GetService("Selection");

import ScriptServices from "utilities/button-utilities/script-services";
import UtilityButton from "./utility-button";

import clearAllEffects from "utilities/button-utilities/clear-all-effects";
import getOrCreate from "utilities/button-utilities/get-or-create";
import isSourceContainer from "utilities/button-utilities/is-source-container";
import promiseAll from "promises/promise-plus/promise-all";
import promiseSource from "utilities/button-utilities/promise-source";
import searchForDuplicates from "utilities/button-utilities/search-for-duplicates";
import smoothNoOutlines from "utilities/button-utilities/smooth-no-outlines";

interface Metadata {
	/**
	 * What will be executed when the button is clicked.
	 */
	callback: () => void;

	/**
	 * The ChangeHistoryService name.
	 */
	name: string;

	/**
	 * Whether or not to record the action in the ChangeHistoryService.
	 */
	shouldRecord: boolean;

	/**
	 * The text on the button.
	 */
	text: string;

	/**
	 * The text to show on the tooltip.
	 */
	tooltip: string;
}

export const UtilityButtonMeta: { [utilityButton in UtilityButton]: Metadata } = {
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

	[UtilityButton.ShowDecompositionGeometry]: {
		callback: () => (PhysicsSettings.ShowDecompositionGeometry = !PhysicsSettings.ShowDecompositionGeometry),
		name: "ShowDecompositionGeometry",
		shouldRecord: false,
		text: "Show Decomposition Geometry",
		tooltip: "Toggles the visibility of the decomposition geometry.",
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
};

export default UtilityButtonMeta;