interface vector2 {
	center: Vector2;
	fromEqual: (value: number) => Vector2;
	fromVector3: (value: Vector3) => Vector2;
	fromVector3NoCache: (value: Vector3) => Vector2;

	fromVector3XY: (value: Vector3) => Vector2;
	fromVector3XYNoCache: (value: Vector3) => Vector2;

	fromX: (value: number) => Vector2;
	fromY: (value: number) => Vector2;
	infinity: Vector2;

	one: Vector2;
	xAxis: Vector2;

	yAxis: Vector2;
	zero: Vector2;
}

declare const vector2: vector2;
export = vector2;
