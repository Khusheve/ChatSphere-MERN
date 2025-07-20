import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { theme } = useTheme();
	const { onlineUsers } = useSocketContext();

	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className='flex-1 flex flex-col relative'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Modern Header */}
					<div className={`relative px-6 py-4 bg-gradient-to-r ${
						theme === 'day' 
							? 'from-white/60 to-white/40 border-b border-white/30' 
							: 'from-black/40 to-black/20 border-b border-white/10'
					} backdrop-blur-xl`}>
						<div className='flex items-center gap-3'>
							<div className={`relative w-10 h-10 rounded-full bg-gradient-to-r ${
								theme === 'day' 
									? 'from-blue-400 to-purple-500' 
									: 'from-purple-400 to-pink-500'
							} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
								{selectedConversation.fullName.charAt(0).toUpperCase()}
								{/* Dynamic online indicator */}
								{onlineUsers.includes(selectedConversation._id) && (
									<div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse'></div>
								)}
							</div>
							<div>
								<h3 className={`font-semibold text-lg ${
									theme === 'day' ? 'text-gray-800' : 'text-white'
								}`}>{selectedConversation.fullName}</h3>
								<p className={`text-sm ${
									theme === 'day' ? 'text-gray-600' : 'text-gray-300'
								}`}>
									{onlineUsers.includes(selectedConversation._id) ? 'Online' : 'Offline'}
								</p>
							</div>
						</div>
						{/* Glowing accent line */}
						<div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
							theme === 'day' 
								? 'from-blue-400 via-purple-500 to-pink-400' 
								: 'from-purple-400 via-pink-500 to-indigo-400'
						} opacity-60`}></div>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	const { theme } = useTheme();
	
	return (
		<div className='flex items-center justify-center w-full h-full relative'>
			{/* Background glow effects */}
			<div className={`absolute inset-0 bg-gradient-to-br ${
				theme === 'day' 
					? 'from-blue-50/50 via-purple-50/30 to-pink-50/50' 
					: 'from-purple-900/20 via-pink-900/10 to-indigo-900/20'
			} rounded-2xl`}></div>
			
			<div className='relative z-10 px-8 text-center flex flex-col items-center gap-6'>
				{/* Welcome message with modern styling */}
				<div className={`p-6 rounded-3xl bg-gradient-to-br ${
					theme === 'day' 
						? 'from-white/60 to-white/30 border border-white/40' 
						: 'from-black/30 to-black/10 border border-white/20'
				} backdrop-blur-xl shadow-2xl`}>
					<div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${
						theme === 'day' 
							? 'from-blue-400 to-purple-500' 
							: 'from-purple-400 to-pink-500'
					} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
						{authUser.fullName.charAt(0).toUpperCase()}
					</div>
					
					<h2 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${
						theme === 'day' 
							? 'from-gray-800 to-gray-600' 
							: 'from-white to-gray-200'
					} bg-clip-text text-transparent`}>
						Welcome back, {authUser.fullName}! 👋
					</h2>
					
					<p className={`text-lg mb-6 ${
						theme === 'day' ? 'text-gray-600' : 'text-gray-300'
					}`}>
						Select a conversation to start chatting
					</p>
					
					<div className={`p-4 rounded-2xl bg-gradient-to-r ${
						theme === 'day' 
							? 'from-blue-100 to-purple-100' 
							: 'from-purple-500/20 to-pink-500/20'
					} backdrop-blur-sm`}>
						<TiMessages className={`text-6xl mx-auto ${
							theme === 'day' 
								? 'text-purple-500' 
								: 'text-purple-300'
						} animate-pulse`} />
					</div>
				</div>
			</div>
		</div>
	);
};

