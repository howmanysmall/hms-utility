//!native
//!optimize 2

import { TextService } from "@rbxts/services";
const getTextBoundsAsync = (getTextBoundsParameters: GetTextBoundsParams) =>
	TextService.GetTextBoundsAsync(getTextBoundsParameters);

export function promiseTextBounds(getTextBoundsParameters: GetTextBoundsParams) {
	return new Promise<Vector2>((resolve, reject) => {
		const [success, value] = pcall(getTextBoundsAsync, getTextBoundsParameters);
		if (success) resolve(value);
		else reject(value);
	});
}

export function promiseTextSize(text: string, textSize: number, font: Font, frameSize: Vector2) {
	const getTextBoundsParameters = new Instance("GetTextBoundsParams");
	getTextBoundsParameters.Font = font;
	getTextBoundsParameters.Size = textSize;
	getTextBoundsParameters.Text = text;
	getTextBoundsParameters.Width = frameSize.X;

	return new Promise<Vector2>((resolve, reject) => {
		const [success, value] = pcall(getTextBoundsAsync, getTextBoundsParameters);
		if (success) resolve(value);
		else reject(value);
	}).timeout(1, "took longer than 1s");
}
