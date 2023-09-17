export default function weldTool(tool: Tool) {
	const handle = tool.FindFirstChild("Handle");
	if (handle && handle.IsA("BasePart"))
		for (const descendant of tool.GetDescendants()) {
			if (descendant === handle || !descendant.IsA("BasePart")) continue;

			const weldConstraint = new Instance("WeldConstraint");
			weldConstraint.Part0 = descendant;
			weldConstraint.Part1 = handle;
			weldConstraint.Parent = handle;
		}
}
