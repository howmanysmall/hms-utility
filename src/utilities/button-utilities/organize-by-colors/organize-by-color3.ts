//!native
//!optimize 2

export default function organizeByColor3(model: Folder | Model) {
	const colorTable = new Map<string, Array<BasePart>>();

	for (const descendant of model.GetDescendants()) {
		const name = descendant.Name;
		if (
			name !== "handle" &&
			name !== "exception" &&
			descendant.IsA("BasePart") &&
			!descendant.IsA("VehicleSeat") &&
			!descendant.IsA("Seat")
		) {
			let array = colorTable.get(descendant.Color.ToHex());
			if (!array) colorTable.set(descendant.Color.ToHex(), (array = []));
			array.push(descendant);
		}
	}

	for (const [hexColor, objects] of colorTable) {
		const newModel = new Instance("Model");
		newModel.Name = hexColor;
		for (const object of objects) object.Parent = newModel;
		newModel.Parent = model;
	}
}
