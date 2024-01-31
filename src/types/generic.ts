//!native
//!optimize 2

import type { Binding } from "@rbxts/roact";

export type BindingOrValue<T> = Binding<T> | T;
export type OnInput<T extends GuiObject = GuiObject> = (rbx: T, inputObject: InputObject) => void;
