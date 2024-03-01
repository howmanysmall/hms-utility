interface udim2 {
	centerScale: UDim2;

	fromOffset: (xOffset: number, yOffset: number) => UDim2;
	// new: (xScale?: number, xOffset?: number, yScale?: number, yOffset?: number) => UDim2;
	fromScale: (xScale: number, yScale: number) => UDim2;
	offset: (value: number) => UDim2;
	offsetFromVector2: (vector2: Vector2) => UDim2;

	offsetFromVector2Cached: (vector2: Vector2) => UDim2;
	oneOffset: UDim2;
	oneScale: UDim2;

	scale: (value: number) => UDim2;
	scaleFromVector2: (vector2: Vector2) => UDim2;

	scaleFromVector2Cached: (vector2: Vector2) => UDim2;
	xOffset: UDim2;

	xScale: UDim2;
	yOffset: UDim2;

	yScale: UDim2;
	zero: UDim2;
}

declare const udim2: udim2;
export = udim2;
