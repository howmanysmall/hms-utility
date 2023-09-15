const ChangeHistoryService = game.GetService("ChangeHistoryService");

export default function tryLogToHistory(callback: () => void, name: string, displayName: string) {
	return () => {
		const recording = ChangeHistoryService.TryBeginRecording(name, displayName);
		if (recording !== undefined) {
			const [success, exception] = pcall(callback);
			if (success) ChangeHistoryService.FinishRecording(recording, Enum.FinishRecordingOperation.Commit, {});
			else {
				warn(`Failed to log to history: ${exception}`);
				ChangeHistoryService.FinishRecording(recording, Enum.FinishRecordingOperation.Cancel, {});
			}
		}
	};
}
