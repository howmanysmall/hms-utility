declare function inSortedOrder<V>(
	dictionary: ReadonlyMap<string, V>,
	sortBy?: (a: string, b: string) => boolean,
): IterableFunction<LuaTuple<[Exclude<string, undefined>, Exclude<V, undefined>]>>;
declare function inSortedOrder<T extends object>(
	dictionary: T,
	sortBy?: (a: keyof T, b: keyof T) => boolean,
): keyof T extends never
	? IterableFunction<LuaTuple<[unknown, defined]>>
	: IterableFunction<LuaTuple<[keyof T, Exclude<T[keyof T], undefined>]>>;

export = inSortedOrder;
