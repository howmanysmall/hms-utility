//!native
//!optimize 2
import BaseTheme from "./base-theme";
import { camelCase } from "utilities/string-utilities";
import type { CamelCaseObjectKeys } from "types/advanced-types";

export type StudioStyleGuideColors = Enum.StudioStyleGuideColor["Name"];
export type StudioStyleGuideModifiers = Enum.StudioStyleGuideModifier["Name"];

export type ColorData = CamelCaseObjectKeys<{ [key in StudioStyleGuideModifiers]: Color3 }>;
export type ThemeName = "Dark" | "Light";
export type Theme = CamelCaseObjectKeys<{ [key in StudioStyleGuideColors]: ColorData }> & {
	themeName: ThemeName;
} & typeof BaseTheme;

const STUDIO_STYLE_GUIDE_COLORS = Enum.StudioStyleGuideColor.GetEnumItems();
const STUDIO_STYLE_GUIDE_MODIFIERS = Enum.StudioStyleGuideModifier.GetEnumItems();
const THEME_CACHE = new Map<ThemeName, Theme>();

function toThemeName(themeName: string) {
	return themeName as ThemeName;
}

export default function getTheme(studioTheme: StudioTheme) {
	const themeName = toThemeName(studioTheme.Name);
	const cached = THEME_CACHE.get(themeName);
	if (cached) return cached;

	const theme = table.clone(BaseTheme) as Theme;
	theme.themeName = themeName;

	for (const studioStyleGuideColor of STUDIO_STYLE_GUIDE_COLORS) {
		const colorData: ColorData = {} as ColorData;
		for (const studioStyleGuideModifier of STUDIO_STYLE_GUIDE_MODIFIERS)
			colorData[camelCase(studioStyleGuideModifier.Name)] = studioTheme.GetColor(
				studioStyleGuideColor,
				studioStyleGuideModifier,
			);

		theme[camelCase(studioStyleGuideColor.Name)] = table.freeze(colorData);
	}

	const frozenTheme = table.freeze(theme);
	THEME_CACHE.set(themeName, frozenTheme);
	return frozenTheme;
}
