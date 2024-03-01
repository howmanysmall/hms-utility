//!native
//!optimize 2

import { useEffect, useMemo } from "@rbxts/react";

interface ConnectionLike {
	Disconnect(): void;
}

interface SignalLike {
	Connect?(callback: Callback): ConnectionLike;
	connect?(callback: Callback): ConnectionLike;
}

type InferSignalParameters<S> = S extends SignalLike
	? Parameters<
			Parameters<
				S["Connect"] extends Callback ? S["Connect"] : S["connect"] extends Callback ? S["connect"] : never
			>
		>
	: never;

function connect<T extends SignalLike>(event: T, callback: (...signalArguments: InferSignalParameters<T>) => void) {
	if ("Connect" in event) {
		assert(typeIs(event.Connect, "function"), "not a function");
		return event.Connect(callback);
	}

	if ("connect" in event) {
		assert(typeIs(event.connect, "function"), "not a function");
		return event.connect(callback);
	}

	return { Disconnect() {} };
}

export function useEventConnection<T extends SignalLike>(
	event: T,
	callback: (...signalArguments: InferSignalParameters<T>) => void,
	dependencies: Array<unknown>,
) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const cachedCallback = useMemo(() => callback, dependencies);

	useEffect(() => {
		const connection = connect(event, cachedCallback);
		return () => connection.Disconnect();
	}, [event, cachedCallback]);
}

export default useEventConnection;
