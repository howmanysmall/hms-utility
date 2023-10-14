//!native
//!optimize 2

namespace String {
	export const trimStart = (source: string) => source.gsub("^[%s]+", "")[0];
	export const trimEnd = (source: string) => source.gsub("[%s]+$", "")[0];
	export const trim = (source: string) => trimStart(trimEnd(source));
}

export = String;
