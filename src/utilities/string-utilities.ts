//!native
//!optimize 2
export function camelCase<T extends string>(value: T): Uncapitalize<T> {
	return (value.sub(1, 1).lower() + value.sub(2)) as Uncapitalize<T>;
}
