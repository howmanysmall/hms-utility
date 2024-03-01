//!native
//!optimize 2

export type SourceContainer = LocalScript | ModuleScript | Script;
export default function isSourceContainer(value: Instance): value is SourceContainer {
	return value.IsA("LuaSourceContainer");
}
