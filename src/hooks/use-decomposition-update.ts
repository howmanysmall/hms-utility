import { Workspace } from "@rbxts/services";
const PhysicsSettings = settings().GetService("PhysicsSettings" as never) as PhysicsSettings;

import { useCallback, useEffect, useRef } from "@rbxts/roact";
import useEventConnection from "./use-event-connection";

export function useDecompositionUpdate() {
	const hasRanYet = useRef(false);

	const updateGeometry = useCallback((initialize?: boolean) => {
		if (initialize === undefined) {
			for (const descendant of Workspace.GetDescendants())
				if (descendant.IsA("TriangleMeshPart")) {
					const transparency = descendant.Transparency;
					descendant.Transparency = 1 - transparency;
					descendant.Transparency = transparency;
				}
		}
	}, []);

	useEffect(() => {
		if (!hasRanYet.current) {
			hasRanYet.current = true;
			updateGeometry(true);
		}
	}, [updateGeometry]);

	useEventConnection(PhysicsSettings.GetPropertyChangedSignal("ShowDecompositionGeometry"), updateGeometry, [
		updateGeometry,
	]);
}

export default useDecompositionUpdate;
