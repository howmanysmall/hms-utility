//!native
//!optimize 2
const EPSILON = 1e-5;

export default function searchForDuplicates(children: Array<Instance>, total = 0) {
	for (const child of children) {
		let localTotal = 0;
		if (child.IsA("BasePart") && !child.IsA("Terrain")) {
			const name = child.Name;
			const orientation = child.Orientation;
			const position = child.Position;
			const size = child.Size;

			child.Name = "PartSingle";

			const parent = child.Parent;
			if (parent)
				for (const descendant of parent.GetChildren())
					if (
						descendant.IsA("BasePart") &&
						descendant.Position.FuzzyEq(position, EPSILON) &&
						descendant.Orientation.FuzzyEq(orientation, EPSILON) &&
						descendant.Size.FuzzyEq(size, EPSILON) &&
						descendant.Name === name
					) {
						localTotal += 1;
						descendant.Parent = undefined;
					}

			child.Name = name;
		}

		total = searchForDuplicates(child.GetDescendants(), total + localTotal);
	}

	return total;
}
