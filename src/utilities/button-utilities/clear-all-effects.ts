//!native
//!optimize 2

import { Lighting } from "@rbxts/services";

export default function clearAllEffects() {
	for (const child of Lighting.GetChildren()) if (child.IsA("PostEffect")) child.Parent = undefined;
}
