import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useAiAssistant from "../../hooks/useAiAssistant";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading: sendLoading, sendMessage } = useSendMessage();
	const { loading: aiLoading, askAi } = useAiAssistant();
	const [aiPromptLoading, setAiPromptLoading] = useState(false);

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
		<div>
			{/* AI Shortcuts */}
			<div className="flex gap-2 mb-2">
				{aiShortcuts.map((sc, idx) => (
					<button
						key={idx}
						className="text-xs bg-gray-600 hover:bg-gray-500 text-white rounded px-2 py-1"
						onClick={() => setMessage(sc.prompt)}
					>
						{sc.label}
					</button>
				))}
			</div>
			<form className='px-4 my-3' onSubmit={handleSubmit}>
				<div className='w-full relative'>
					<input
						type='text'
						className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
						placeholder='Send a message or type /ai ...'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
						{(sendLoading || aiLoading || aiPromptLoading) ? <div className='loading loading-spinner'></div> : <BsSend />}
					</button>
				</div>
			</form>
		</div>
	);
};
export default MessageInput;

