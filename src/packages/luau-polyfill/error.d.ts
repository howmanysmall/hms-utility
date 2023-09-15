export interface Error {
	name: string;
	message: string;
	stack?: string;
}

interface ErrorConstructor {
	new (message?: string): Error;
	(message?: string): Error;
}

declare const Error: ErrorConstructor;
export default Error;
