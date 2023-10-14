//!native
//!optimize 2
import { useState, useEffect, useMemo } from "@rbxts/roact";
import getTheme from "utilities/get-theme";

export function useTheme() {
	const studio = useMemo(() => settings().Studio, []);
	const [theme, setTheme] = useState(getTheme(studio.Theme));

	useEffect(() => {
		const connection = studio.ThemeChanged.Connect(() => setTheme(getTheme(studio.Theme)));
		return () => connection.Disconnect();
	}, [studio]);

	return theme;
}

export default useTheme;
