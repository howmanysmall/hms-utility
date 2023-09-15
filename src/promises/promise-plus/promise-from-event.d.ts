// talk about INFURIATING? AM I RIGHT????

interface ConnectionLike {
	Disconnect(): void;
}

/**
 * Converts an event into a Promise which resolves the next time the event fires.
 *
 * The optional `predicate` callback, if passed, will receive the event arguments and should return `true` or `false`, based on if this fired event should resolve the Promise or not. If `true`, the Promise resolves. If `false`, nothing happens and the predicate will be rerun the next time the event fires.
 *
 * The Promise will resolve with the event arguments.
 *
 * > This function will work given any object with a `Connect` method. This includes all Roblox events.
 * ```lua
 * -- Creates a Promise which only resolves when `somePart` is touched by a part named `"Something specific"`.
 * return Promise.fromEvent(somePart.Touched, function(part)
 *     return part.Name == "Something specific"
 * end)
 * ```
 */
declare function promiseFromEvent<T>(
	event: RBXScriptSignal<(value: T) => void>,
	predicate?: (value: T) => boolean,
): Promise<T>;
declare function promiseFromEvent(event: RBXScriptSignal<() => void>, predicate?: () => boolean): Promise<void>;
declare function promiseFromEvent<T>(
	event: { Connect: (callback: (value: T) => void) => ConnectionLike },
	predicate?: (value: T) => boolean,
): Promise<T>;
declare function promiseFromEvent(
	event: { Connect: (callback: () => void) => ConnectionLike },
	predicate?: () => boolean,
): Promise<void>;

export = promiseFromEvent;
