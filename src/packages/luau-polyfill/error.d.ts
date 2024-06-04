export interface Error {
	message: string;
	name: string;
	stack?: string;
}

interface ErrorConstructor {
	new (message?: string): Error;
	(message?: string): Error;
	readonly captureStackTrace: (error: Error, options?: Callback) => void;
}

declare const Error: ErrorConstructor;
export default Error;
