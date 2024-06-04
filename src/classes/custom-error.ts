//!native
//!optimize 2

import { Error } from "packages/luau-polyfill";

export interface Exception {
	readonly message: string;
	readonly type: string;
}

export default class CustomError extends Error {
	public constructor(exception: Exception) {
		// super(`${exception.type}: ${exception.message}`);
		super();
		this.name = exception.type;
		this.message = exception.message;
	}
}

const metatable = CustomError as LuaMetatable<CustomError>;
metatable.__tostring = (customError) => (getmetatable(Error) as Required<LuaMetatable<Error>>).__tostring(customError);
