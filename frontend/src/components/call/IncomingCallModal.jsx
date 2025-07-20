import { useWebRTC } from '../../context/WebRTCContext';
import { useTheme } from '../../context/ThemeContext';
import useGetConversations from '../../hooks/useGetConversations';
import { BsTelephone, BsTelephoneX, BsCameraVideo } from 'react-icons/bs';
import { useEffect, useState } from 'react';

const IncomingCallModal = () => {
	const { 
		callState, 
		currentCall, 
		callType,
		acceptCall, 
		rejectCall,
		CALL_STATES 
	} = useWebRTC();
	
	const { conversations } = useGetConversations();
	const { theme } = useTheme();
	const [caller, setCaller] = useState(null);

	useEffect(() => {
		if (currentCall && currentCall.from) {
			// Find caller info from conversations
			const callerInfo = conversations.find(conv => conv._id === currentCall.from);
			setCaller(callerInfo);
		}
	}, [currentCall, conversations]);

	if (callState !== CALL_STATES.INCOMING || !currentCall) return null;

	const handleAccept = () => {
		acceptCall(currentCall);
	};

	const handleReject = () => {
		rejectCall(currentCall);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
			<div className={`relative w-full max-w-md mx-4 p-8 rounded-3xl bg-gradient-to-br ${
				theme === 'day' 
					? 'from-white/95 to-gray-50/90 border border-gray-200/50' 
					: 'from-black/90 to-gray-900/80 border border-white/10'
			} backdrop-blur-2xl shadow-2xl animate-pulse-slow`}>
				
				{/* Glowing accent line */}
				<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
					theme === 'day' 
						? 'from-blue-400 via-purple-500 to-pink-400' 
						: 'from-purple-400 via-pink-500 to-indigo-400'
				} rounded-t-3xl`} />

				{/* Caller info */}
				<div className="text-center mb-8">
					<div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${
						theme === 'day' 
							? 'from-blue-500 to-purple-600' 
							: 'from-purple-600 to-indigo-700'
					} flex items-center justify-center shadow-lg animate-pulse`}>
						{caller?.profilePic ? (
							<img 
								src={caller.profilePic} 
								alt={caller.fullName}
								className="w-full h-full rounded-full object-cover"
							/>
						) : (
							<span className="text-2xl font-bold text-white">
								{caller?.fullName?.charAt(0)?.toUpperCase() || 'U'}
							</span>
						)}
					</div>
					
					<h2 className={`text-2xl font-bold mb-2 ${
						theme === 'day' ? 'text-gray-900' : 'text-white'
					}`}>
						{caller?.fullName || 'Unknown Caller'}
					</h2>
					
					<div className="flex items-center justify-center gap-2 mb-2">
						{callType === 'video' ? (
							<BsCameraVideo className={`w-5 h-5 ${
								theme === 'day' ? 'text-blue-600' : 'text-blue-400'
							}`} />
						) : (
							<BsTelephone className={`w-5 h-5 ${
								theme === 'day' ? 'text-green-600' : 'text-green-400'
							}`} />
						)}
						<span className={`text-lg font-medium ${
							theme === 'day' ? 'text-gray-700' : 'text-gray-300'
						}`}>
							Incoming {callType} call
						</span>
					</div>
					
					<p className={`text-sm ${
						theme === 'day' ? 'text-gray-500' : 'text-gray-400'
					} animate-pulse`}>
						Ringing...
					</p>
				</div>

				{/* Call action buttons */}
				<div className="flex items-center justify-center gap-8">
					{/* Reject button */}
					<button
						onClick={handleReject}
						className="group relative w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
						title="Decline call"
					>
						<BsTelephoneX className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
						
						{/* Ripple effect */}
						<div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
					</button>

					{/* Accept button */}
					<button
						onClick={handleAccept}
						className="group relative w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
						title="Accept call"
					>
						<BsTelephone className="w-6 h-6 text-white group-hover:-rotate-12 transition-transform duration-300" />
						
						{/* Ripple effect */}
						<div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
					</button>
				</div>

				{/* Call type indicator */}
				<div className="mt-6 text-center">
					<span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
						theme === 'day' 
							? 'bg-gray-100 text-gray-700' 
							: 'bg-white/10 text-gray-300'
					}`}>
						{callType === 'video' ? (
							<>
								<BsCameraVideo className="w-3 h-3" />
								Video Call
							</>
						) : (
							<>
								<BsTelephone className="w-3 h-3" />
								Voice Call
							</>
						)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default IncomingCallModal;
