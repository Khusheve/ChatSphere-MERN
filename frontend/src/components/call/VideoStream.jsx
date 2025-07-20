import { useEffect } from 'react';
import { useWebRTC } from '../../context/WebRTCContext';
import { useTheme } from '../../context/ThemeContext';
import useConversation from '../../zustand/useConversation';
import { BsCameraVideoOff, BsMicMute } from 'react-icons/bs';

const VideoStream = () => {
	const { 
		callState, 
		currentCall, 
		localStream, 
		remoteStream,
		isVideoEnabled,
		isAudioEnabled,
		callType,
		localVideoRef,
		remoteVideoRef,
		CALL_STATES 
	} = useWebRTC();
	
	const { selectedConversation } = useConversation();
	const { theme } = useTheme();

	const isInCall = callState === CALL_STATES.CONNECTED || 
					 callState === CALL_STATES.CALLING;

	useEffect(() => {
		if (localVideoRef.current && localStream) {
			localVideoRef.current.srcObject = localStream;
		}
	}, [localStream]);

	useEffect(() => {
		if (remoteVideoRef.current && remoteStream) {
			remoteVideoRef.current.srcObject = remoteStream;
		}
	}, [remoteStream]);

	if (!isInCall || !currentCall) return null;

	return (
		<div className={`relative w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${
			theme === 'day' 
				? 'from-gray-900 to-black' 
				: 'from-gray-800 to-black'
		} shadow-2xl`}>
			
			{/* Remote video stream */}
			{callType === 'video' ? (
				<video
					ref={remoteVideoRef}
					autoPlay
					playsInline
					className="w-full h-full object-cover"
					style={{ transform: 'scaleX(-1)' }} // Mirror effect
				/>
			) : (
				<div className="w-full h-full flex items-center justify-center">
					<div className={`w-24 h-24 rounded-full bg-gradient-to-br ${
						theme === 'day' 
							? 'from-blue-500 to-purple-600' 
							: 'from-purple-600 to-indigo-700'
					} flex items-center justify-center shadow-lg`}>
						<span className="text-2xl font-bold text-white">
							{selectedConversation?.fullName?.charAt(0)?.toUpperCase() || 'U'}
						</span>
					</div>
				</div>
			)}

			{/* Remote stream placeholder when no video */}
			{callType === 'video' && !remoteStream && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
					<div className="text-center">
						<BsCameraVideoOff className="w-12 h-12 text-gray-400 mx-auto mb-2" />
						<p className="text-gray-300 text-sm">
							{callState === CALL_STATES.CALLING ? 'Connecting...' : 'Camera off'}
						</p>
					</div>
				</div>
			)}

			{/* Local video stream (Picture-in-Picture) */}
			{callType === 'video' && localStream && (
				<div className="absolute top-4 right-4 w-32 h-24 rounded-xl overflow-hidden bg-gray-900 shadow-lg border-2 border-white/20">
					<video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						className="w-full h-full object-cover"
						style={{ transform: 'scaleX(-1)' }} // Mirror effect
					/>
					
					{/* Local video controls overlay */}
					<div className="absolute inset-0 bg-black/20">
						{!isVideoEnabled && (
							<div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
								<BsCameraVideoOff className="w-6 h-6 text-white" />
							</div>
						)}
						
						{!isAudioEnabled && (
							<div className="absolute top-1 left-1 p-1 rounded bg-red-500/80">
								<BsMicMute className="w-3 h-3 text-white" />
							</div>
						)}
					</div>
				</div>
			)}

			{/* Audio-only call local indicator */}
			{callType === 'audio' && (
				<div className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 backdrop-blur-sm">
					<div className="flex items-center gap-2">
						<div className={`w-2 h-2 rounded-full ${
							isAudioEnabled ? 'bg-green-500' : 'bg-red-500'
						}`} />
						<span className="text-white text-xs">
							{isAudioEnabled ? 'Mic on' : 'Mic off'}
						</span>
					</div>
				</div>
			)}

			{/* Call info overlay */}
			<div className="absolute bottom-4 left-4 right-4">
				<div className="bg-black/40 backdrop-blur-sm rounded-xl p-3">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-white font-medium">
								{selectedConversation?.fullName || 'Unknown User'}
							</h3>
							<p className="text-gray-300 text-sm">
								{callState === CALL_STATES.CALLING ? 'Calling...' : 
								 callState === CALL_STATES.CONNECTED ? 'Connected' : 'In call'}
							</p>
						</div>
						
						<div className="flex items-center gap-2">
							<div className={`w-2 h-2 rounded-full ${
								callState === CALL_STATES.CONNECTED ? 'bg-green-500' : 'bg-yellow-500'
							} animate-pulse`} />
							<span className="text-gray-300 text-xs uppercase tracking-wide">
								{callType}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VideoStream;
