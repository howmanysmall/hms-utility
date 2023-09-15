declare global {
	namespace JSX {
		interface IntrinsicElements {
			camera: JSX.IntrinsicElement<Camera>;
			folder: JSX.IntrinsicElement<Folder>;
			model: JSX.IntrinsicElement<Model>;
			part: JSX.IntrinsicElement<Part>;
			worldmodel: JSX.IntrinsicElement<WorldModel>;
		}
	}
}

export {};
