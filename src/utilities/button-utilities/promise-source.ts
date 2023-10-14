//!native
//!optimize 2
import type { SourceContainer } from "./is-source-container";

export default function promiseSource(sourceContainer: SourceContainer) {
	return new Promise<string>((resolve) => {
		let source = sourceContainer.Source;
		if (!source)
			while (!source) {
				source = sourceContainer.Source;
				task.wait();
			}

		resolve(source);
	});
}
