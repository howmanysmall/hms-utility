//!native
//!optimize 2

import { RunService } from "@rbxts/services";

export interface Scrollable {
	scrollToOffset(x: number, y: number, animate: boolean): void;
}

export function scrollNow(
	scrollable: Scrollable,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	speedMultiplier = 1,
): Promise<void> {
	return new Promise((resolve) => {
		scrollable.scrollToOffset(fromX, fromY, false);
		const incrementPerMs = speedMultiplier / 10;
		let startTime = os.clock();
		let startX = fromX;
		let startY = fromY;

		const connection = RunService.PreRender.Connect(() => {
			const currentTime = os.clock();
			const timeElapsed = currentTime - startTime;
			const distanceToCover = incrementPerMs * timeElapsed;

			startX += distanceToCover;
			startY += distanceToCover;
			scrollable.scrollToOffset(math.min(toX, startX), math.min(toY, startY), false);
			startTime = currentTime;

			if (math.min(toX, startX) === toX && math.min(toY, startY) === toY) {
				connection.Disconnect();
				resolve();
			}
		});
	});
}
