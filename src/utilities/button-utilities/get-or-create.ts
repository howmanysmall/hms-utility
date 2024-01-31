//!native
//!optimize 2

export default function getOrCreate<T extends keyof CreatableInstances>(parent: Instance, className: T, name?: string) {
	if (name !== undefined) {
		for (const child of parent.GetChildren()) if (child.IsA(className) && child.Name === name) return child;

		const instance = new Instance(className);
		instance.Name = name;
		instance.Parent = parent;
		return instance;
	}

	for (const child of parent.GetChildren()) if (child.IsA(className)) return child;
	const instance = new Instance(className);
	instance.Parent = parent;
	return instance;
}
