import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import { useTheme } from "../../context/ThemeContext";

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { theme } = useTheme();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = onlineUsers.includes(conversation._id);

	return (
		<>
			<div
				className={`relative flex gap-3 items-center rounded-2xl p-3 my-1 cursor-pointer transition-all duration-300 group ${
					isSelected 
						? `bg-gradient-to-r ${
								theme === 'day' 
									? 'from-blue-500/20 to-purple-500/20 border border-blue-300/30' 
									: 'from-purple-500/30 to-pink-500/30 border border-purple-400/40'
							} shadow-lg backdrop-blur-sm`
						: `hover:bg-gradient-to-r ${
								theme === 'day' 
									? 'hover:from-white/40 hover:to-gray-100/40 hover:border hover:border-white/40' 
									: 'hover:from-white/10 hover:to-white/5 hover:border hover:border-white/20'
							} hover:shadow-md hover:backdrop-blur-sm`
				}`}
				onClick={() => setSelectedConversation(conversation)}
			>
				{/* Glowing accent for selected conversation */}
				{isSelected && (
					<div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${
						theme === 'day' 
							? 'from-blue-400 to-purple-500' 
							: 'from-purple-400 to-pink-500'
					} shadow-lg`}></div>
				)}
				
				<div className={`relative avatar ${isOnline ? "online" : ""}`}>
					<div className='w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300'>
						<img src={conversation.profilePic} alt='user avatar' className='w-full h-full object-cover' />
					</div>
					{isOnline && (
						<div className='absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse'></div>
					)}
				</div>

				<div className='flex flex-col flex-1 min-w-0'>
					<div className='flex gap-3 justify-between items-center'>
						<p className={`font-semibold truncate ${
							theme === 'day' ? 'text-gray-800' : 'text-white'
						} group-hover:text-opacity-90 transition-all duration-300`}>
							{conversation.fullName}
						</p>
						<span className='text-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300'>{emoji}</span>
					</div>
					<p className={`text-sm opacity-60 ${
						theme === 'day' ? 'text-gray-600' : 'text-gray-300'
					} group-hover:opacity-80 transition-all duration-300`}>
						{isOnline ? 'Online' : 'Offline'}
					</p>
				</div>
			</div>

			{!lastIdx && (
				<div className={`mx-4 h-px bg-gradient-to-r ${
					theme === 'day' 
						? 'from-transparent via-gray-300/50 to-transparent' 
						: 'from-transparent via-white/10 to-transparent'
				}`}></div>
			)}
		</>
	);
};
export default Conversation;

