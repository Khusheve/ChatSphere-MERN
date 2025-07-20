import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

const Home = () => {
	const { getThemeConfig } = useTheme();
	const themeConfig = getThemeConfig();
	
	return (
		<div className='relative w-full max-w-6xl mx-auto'>
			{/* Theme Toggle */}
			<div className="absolute top-4 right-4 z-20">
				<ThemeToggle />
			</div>
			
			{/* Main Chat Container */}
			<div className={`flex sm:h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl`}>
				<Sidebar />
				<MessageContainer />
			</div>
		</div>
	);
};
export default Home;
