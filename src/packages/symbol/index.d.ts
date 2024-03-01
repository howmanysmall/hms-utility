declare const SymbolObject: {
	(name?: string): symbol;
	for: (name?: string) => symbol;
} & Record<string, symbol>;

export = SymbolObject;
