import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Theme configurations
const THEMES = {
	day: {
		name: 'day',
		classes: [],
		background: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100',
		primary: 'from-blue-500 to-purple-600',
		secondary: 'from-white to-gray-50',
		accent: 'from-indigo-400 to-purple-500'
	},
	night: {
		name: 'night',
		classes: ['dark'],
		background: 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900',
		primary: 'from-purple-500 to-pink-600',
		secondary: 'from-slate-800 to-slate-900',
		accent: 'from-indigo-500 to-purple-600'
	}
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		// Check localStorage first, then system preference
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme && THEMES[savedTheme]) return savedTheme;
		
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
	});

	useEffect(() => {
		localStorage.setItem("theme", theme);
		
		// Remove all theme classes first
		Object.values(THEMES).forEach(themeConfig => {
			themeConfig.classes.forEach(className => {
				document.documentElement.classList.remove(className);
			});
		});
		
		// Apply current theme classes
		THEMES[theme].classes.forEach(className => {
			document.documentElement.classList.add(className);
		});
	}, [theme]);

	const toggleTheme = () => {
		setTheme(prev => prev === "day" ? "night" : "day");
	};

	const setSpecificTheme = (newTheme) => {
		if (THEMES[newTheme]) {
			setTheme(newTheme);
		}
	};

	const getThemeConfig = () => THEMES[theme];

	return (
		<ThemeContext.Provider value={{ 
			theme, 
			toggleTheme, 
			setSpecificTheme,
			getThemeConfig,
			themes: Object.keys(THEMES)
		}}>
			{children}
		</ThemeContext.Provider>
	);
};
