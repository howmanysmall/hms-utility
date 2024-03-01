//!native
//!optimize 2

import React from "@rbxts/react";
import * as ReactRoblox from "@rbxts/react-roblox";

type React = typeof React;
type ReactRoblox = typeof ReactRoblox;

interface StoryProperties<T extends object> {
	controls: T;
}

export interface Storybook {
	name?: string;
	react: React;
	reactRoblox: ReactRoblox;
	storyRoots: ReadonlyArray<Instance>;
}

interface BaseFunctionStory {
	name?: string;
	summary?: string;
}

interface BaseStory extends BaseFunctionStory {
	react: React;
	reactRoblox: ReactRoblox;
}

export interface ReactStory extends BaseStory {
	story: React.Element;
}

export interface ReactStoryWith<T extends object> extends BaseStory {
	controls: T;
	story: React.Element | React.FunctionComponent<StoryProperties<T>>;
}

export interface FunctionStory extends BaseFunctionStory {
	story: (target: GuiObject) => () => void;
}

export interface FunctionStoryWith<T extends object> extends BaseFunctionStory {
	controls: T;
	story: (target: GuiObject, properties: StoryProperties<T>) => () => void;
}

export type HoarcekatStory = (target: GuiObject) => () => void;
