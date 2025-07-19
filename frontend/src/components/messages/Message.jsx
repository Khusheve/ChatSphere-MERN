import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();

	const isAi = message.isAi || message.senderId === "chatbot";
	const fromMe = message.senderId === authUser._id;
	const formattedTime = message.createdAt ? extractTime(message.createdAt) : "";

	let chatClassName = fromMe ? "chat-end" : "chat-start";
	let profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	let bubbleBgColor = fromMe ? "bg-blue-500" : "";
	let senderName = fromMe ? authUser.username : selectedConversation?.username;

	if (isAi) {
		profilePic = "/chatbot.jpg"; // You can use a generic bot image or emoji
		bubbleBgColor = "bg-gradient-to-r from-indigo-500 to-blue-400 text-white border border-blue-300";
		chatClassName = "chat-start";
		senderName = "chatbot";
	}

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='AI avatar' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble ${bubbleBgColor} ${shakeClass} pb-2`}>
				{isAi && <div className="font-bold text-xs mb-1 text-blue-100">🤖 {senderName}</div>}
				{message.message}
			</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;
