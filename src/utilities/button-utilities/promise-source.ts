//!native
//!optimize 2

const ScriptEditorService = game.GetService("ScriptEditorService");
import type { SourceContainer } from "./is-source-container";

export default function promiseSource(sourceContainer: SourceContainer) {
	return new Promise<string>((resolve) => {
		let source = ScriptEditorService.GetEditorSource(sourceContainer);
		if (!source)
			while (!source) {
				source = ScriptEditorService.GetEditorSource(sourceContainer);
				task.wait();
			}

		resolve(source);
	});
}
