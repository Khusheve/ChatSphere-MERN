import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useAiAssistant from "../../hooks/useAiAssistant";
import { useTheme } from "../../context/ThemeContext";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading: sendLoading, sendMessage } = useSendMessage();
	const { loading: aiLoading, askAi } = useAiAssistant();
	const [aiPromptLoading, setAiPromptLoading] = useState(false);
	const { theme } = useTheme();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		if (message.startsWith("/ai ")) {
			setAiPromptLoading(true);
			await askAi(message.replace("/ai ", ""));
			setAiPromptLoading(false);
			setMessage("");
			return;
		}
		await sendMessage(message);
		setMessage("");
	};

	// Example AI shortcuts
	const aiShortcuts = [
		{ label: "Summarize recent messages", prompt: "/ai summarize our recent chat" },
		{ label: "Suggest next question", prompt: "/ai what should I ask next?" },
		{ label: "Reply to last message", prompt: "/ai reply to the last message" },
	];

	return (
		<div className={`relative p-4 bg-gradient-to-t ${
			theme === 'day' 
				? 'from-white/80 via-blue-50/60 to-purple-50/40 border-t border-blue-200/40' 
				: 'from-slate-900/80 via-purple-900/40 to-indigo-900/60 border-t border-purple-400/20'
		} backdrop-blur-xl shadow-2xl`}>
			{/* Glowing accent line */}
			<div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
				theme === 'day' 
					? 'from-blue-400 via-purple-500 to-pink-400' 
					: 'from-purple-400 via-pink-500 to-indigo-400'
			} opacity-60`}></div>
			
			{/* AI Shortcuts */}
			<div className="flex gap-2 mb-4 flex-wrap">
				{aiShortcuts.map((sc, idx) => (
					<button
						key={idx}
						className={`text-xs px-3 py-2 rounded-full bg-gradient-to-r ${
							theme === 'day' 
								? 'from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-gray-700 border border-blue-200/50' 
								: 'from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-gray-200 border border-purple-400/30'
						} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg`}
						onClick={() => setMessage(sc.prompt)}
					>
						{sc.label}
					</button>
				))}
			</div>
			
			<form onSubmit={handleSubmit}>
				<div className='relative flex items-center gap-3'>
					<div className='flex-1 relative'>
						<input
							type='text'
							className={`w-full px-4 py-4 pr-12 bg-gradient-to-r ${
								theme === 'day' 
									? 'from-white/80 to-blue-50/60 border border-blue-200/50 text-gray-800 placeholder-gray-500' 
									: 'from-black/40 to-purple-900/30 border border-purple-400/30 text-white placeholder-gray-400'
							} backdrop-blur-md rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-lg`}
							placeholder='Send a message or type /ai for AI assistance...'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						
						{/* Send button inside input */}
						<button 
							type='submit' 
							className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r ${
								theme === 'day' 
									? 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
									: 'from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
							} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed`}
							disabled={sendLoading || aiLoading || aiPromptLoading}
						>
							{(sendLoading || aiLoading || aiPromptLoading) ? (
								<div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
							) : (
								<BsSend className='w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300' />
							)}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};
export default MessageInput;

