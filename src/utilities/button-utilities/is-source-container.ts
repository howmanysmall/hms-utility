export type SourceContainer = ModuleScript | LocalScript | Script;
export default function isSourceContainer(value: Instance): value is SourceContainer {
	return value.IsA("LuaSourceContainer");
}
