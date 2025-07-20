import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { useTheme } from "../../context/ThemeContext";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();
	const { theme } = useTheme();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	return (
		<div className={`relative flex-1 overflow-auto bg-gradient-to-br ${
			theme === 'day' 
				? 'from-blue-50/30 via-white/20 to-purple-50/30' 
				: 'from-slate-900/40 via-purple-900/20 to-indigo-900/40'
		} backdrop-blur-sm`}>
			{/* Decorative gradient overlay */}
			<div className={`absolute inset-0 bg-gradient-to-t ${
				theme === 'day' 
					? 'from-transparent via-blue-50/10 to-purple-50/20' 
					: 'from-transparent via-purple-900/10 to-pink-900/20'
			} pointer-events-none`}></div>
			
			<div className='relative z-10 px-6 py-4 space-y-4'>
				{!loading &&
					messages.length > 0 &&
					messages.map((message) => (
						<div key={message._id} ref={lastMessageRef}>
							<Message message={message} />
						</div>
					))}

				{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
				{!loading && messages.length === 0 && (
					<div className={`text-center py-12 px-6 rounded-2xl bg-gradient-to-br ${
						theme === 'day' 
							? 'from-white/60 to-blue-50/40 border border-blue-200/30' 
							: 'from-black/30 to-purple-900/20 border border-purple-400/20'
					} backdrop-blur-xl shadow-lg`}>
						<p className={`text-lg font-medium ${
							theme === 'day' ? 'text-gray-600' : 'text-gray-300'
						}`}>Send a message to start the conversation</p>
					</div>
				)}
			</div>
		</div>
	);
};
export default Messages;

