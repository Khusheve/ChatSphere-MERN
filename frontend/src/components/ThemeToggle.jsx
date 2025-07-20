import { useTheme } from "../context/ThemeContext";
import { BsSun, BsMoon } from "react-icons/bs";

const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="relative p-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30 transition-all duration-300 group shadow-lg hover:shadow-xl"
			aria-label={`Switch to ${theme === "day" ? "night" : "day"} mode`}
		>
			<div className="relative w-6 h-6 flex items-center justify-center">
				{theme === "day" ? (
					<BsMoon className="w-5 h-5 text-indigo-600 dark:text-purple-400 transition-all duration-300 group-hover:scale-110" />
				) : (
					<BsSun className="w-5 h-5 text-yellow-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
				)}
				{/* Glow effect */}
				<div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
			</div>
		</button>
	);
};

export default ThemeToggle;
