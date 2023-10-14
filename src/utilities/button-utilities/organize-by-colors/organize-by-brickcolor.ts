//!native
//!optimize 2
export default function organizeByBrickColor(model: Model | Folder) {
	const colorTable = new Map<BrickColorsByNumber[keyof BrickColorsByNumber], Array<BasePart>>();

	for (const descendant of model.GetDescendants()) {
		const name = descendant.Name;
		if (
			name !== "handle" &&
			name !== "exception" &&
			descendant.IsA("BasePart") &&
			!descendant.IsA("VehicleSeat") &&
			!descendant.IsA("Seat")
		) {
			let array = colorTable.get(descendant.BrickColor.Name);
			if (!array) colorTable.set(descendant.BrickColor.Name, (array = []));
			array.push(descendant);
		}
	}

	for (const [brickColorName, objects] of colorTable) {
		const newModel = new Instance("Model");
		newModel.Name = brickColorName;
		for (const object of objects) object.Parent = newModel;
		newModel.Parent = model;
	}
}
