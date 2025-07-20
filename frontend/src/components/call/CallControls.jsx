import { useTheme } from '../../context/ThemeContext';
import useConversation from '../../zustand/useConversation';
import { useWebRTC } from '../../context/WebRTCContext';
import { BsTelephone, BsCameraVideo } from 'react-icons/bs';
import toast from 'react-hot-toast';

const CallControls = () => {
	const { selectedConversation } = useConversation();
	const { theme } = useTheme();
	const { initiateCall, endCall, callState, CALL_STATES } = useWebRTC();

	// Always render if there's a selected conversation
	if (!selectedConversation) {
		console.log('CallControls: No selected conversation');
		return null;
	}

	console.log('CallControls: Rendering for', selectedConversation.fullName);

	// Check if already in a call
	const isInCall = callState === CALL_STATES.CONNECTED || 
					 callState === CALL_STATES.CALLING ||
					 callState === CALL_STATES.INCOMING;

	const handleVoiceCall = async () => {
		if (isInCall) {
			toast.error('Already in a call');
			return;
		}
		
		// Prevent auto-calling - ensure user explicitly clicked
		if (!selectedConversation?._id) {
			toast.error('Please select a conversation first');
			return;
		}
		
		console.log('🎵 Voice call initiated for:', selectedConversation.fullName);
		try {
			await initiateCall(selectedConversation._id, 'audio');
			toast.success(`Starting voice call with ${selectedConversation.fullName}`);
		} catch (error) {
			console.error('Voice call failed:', error);
			toast.error('Failed to start voice call');
		}
	};

	const handleVideoCall = async () => {
		if (isInCall) {
			toast.error('Already in a call');
			return;
		}
		
		// Prevent auto-calling - ensure user explicitly clicked
		if (!selectedConversation?._id) {
			toast.error('Please select a conversation first');
			return;
		}
		
		console.log('📹 Video call initiated for:', selectedConversation.fullName);
		try {
			await initiateCall(selectedConversation._id, 'video');
			toast.success(`Starting video call with ${selectedConversation.fullName}`);
		} catch (error) {
			console.error('Video call failed:', error);
			toast.error('Failed to start video call');
		}
	};

	const handleEndCall = async () => {
		try {
			await endCall();
			toast.success('Call ended');
		} catch (error) {
			console.error('Failed to end call:', error);
			toast.error('Failed to end call');
		}
	};

	// Show different UI based on call state
	if (isInCall) {
		return (
			<div className="flex items-center gap-4">
				{/* Call Status Indicator */}
				<div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
					theme === 'day'
						? 'bg-red-500/20 border border-red-500/50'
						: 'bg-red-500/20 border border-red-500/50'
				} backdrop-blur-sm`}>
					<div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
					<span className={`text-sm font-medium ${
						theme === 'day' ? 'text-red-600' : 'text-red-400'
					}`}>
						{callState === CALL_STATES.CALLING ? 'Calling...' : 
						 callState === CALL_STATES.INCOMING ? 'Incoming...' : 'Connected'}
					</span>
				</div>

				{/* End Call Button */}
				<button
					onClick={handleEndCall}
					className={`relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
						theme === 'day'
							? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50'
							: 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50'
					} backdrop-blur-sm hover:shadow-lg hover:shadow-red-500/25`}
					title="End Call"
				>
					<svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
						<path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
						<path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
					</svg>
				</button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-4">
			{/* Voice Call Button */}
			<button
				onClick={handleVoiceCall}
				className={`relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
					theme === 'day'
						? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50'
						: 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50'
				} backdrop-blur-sm hover:shadow-lg hover:shadow-green-500/25`}
				title="Voice Call"
			>
				<BsTelephone className="w-5 h-5 text-green-400" />
			</button>

			{/* Video Call Button */}
			<button
				onClick={handleVideoCall}
				className={`relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
					theme === 'day'
						? 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50'
						: 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50'
				} backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/25`}
				title="Video Call"
			>
				<BsCameraVideo className="w-5 h-5 text-blue-400" />
			</button>
		</div>
	);
};

export default CallControls;
