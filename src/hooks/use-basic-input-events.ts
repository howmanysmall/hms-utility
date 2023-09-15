import { useCallback, useState } from "@rbxts/roact";
import type { OnInput } from "types/generic";

export function useBasicInputEvents<T extends GuiObject>(canRun?: boolean) {
	const [hovered, setHovered] = useState(false);
	const [pressed, setPressed] = useState(false);

	const onInputBegan = useCallback<OnInput<T>>(
		(_, inputObject) => {
			if (canRun) {
				if (inputObject.UserInputType === Enum.UserInputType.MouseMovement) setHovered(true);
				else if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) setPressed(true);
			}
		},
		[canRun],
	);

	const onInputEnded = useCallback<OnInput<T>>(
		(_, inputObject) => {
			if (canRun) {
				if (inputObject.UserInputType === Enum.UserInputType.MouseMovement) setHovered(false);
				else if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) setPressed(false);
			}
		},
		[canRun],
	);

	return table.freeze({
		hovered,
		pressed,
		onInputBegan,
		onInputEnded,

		setHovered,
		setPressed,
	});
}

export default useBasicInputEvents;
