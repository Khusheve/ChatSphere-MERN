import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { useTheme } from "../../context/ThemeContext";

const Sidebar = () => {
	const { theme } = useTheme();
	
	return (
		<div className={`relative w-80 p-6 flex flex-col bg-gradient-to-br ${
			theme === 'day' 
				? 'from-white/90 via-blue-50/80 to-purple-50/70 border-r border-blue-200/40 shadow-xl' 
				: 'from-slate-900/90 via-purple-900/60 to-indigo-900/70 border-r border-purple-400/20 shadow-2xl'
		} backdrop-blur-2xl`}>
			{/* Glowing accent line */}
			<div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b ${
				theme === 'day' 
					? 'from-blue-400 via-purple-500 to-pink-400' 
					: 'from-purple-400 via-pink-500 to-indigo-400'
			} opacity-60`}></div>
			
			<SearchInput />
			
			{/* Modern divider */}
			<div className={`my-6 h-px bg-gradient-to-r ${
				theme === 'day' 
					? 'from-transparent via-gray-300 to-transparent' 
					: 'from-transparent via-white/20 to-transparent'
			}`}></div>
			
			<Conversations />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;

