//!native
//!optimize 2

export type CamelCaseKeys<T extends object> = Uncapitalize<keyof T & string>;
export type CamelCaseObjectKeys<T extends object> = {
	[key in CamelCaseKeys<T>]: Capitalize<key> extends keyof T ? T[Capitalize<key>] : never;
};
