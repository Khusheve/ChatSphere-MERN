import { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { useSocketContext } from './SocketContext';
import { useAuthContext } from './AuthContext';
import toast from 'react-hot-toast';

const WebRTCContext = createContext();

export const useWebRTC = () => {
	return useContext(WebRTCContext);
};

// WebRTC configuration
const rtcConfig = {
	iceServers: [
		{ urls: 'stun:stun.l.google.com:19302' },
		{ urls: 'stun:stun1.l.google.com:19302' },
	],
};

// Call states
const CALL_STATES = {
	IDLE: 'idle',
	CALLING: 'calling',
	INCOMING: 'incoming',
	CONNECTED: 'connected',
	ENDING: 'ending',
};

// Initial state
const initialState = {
	callState: CALL_STATES.IDLE,
	currentCall: null,
	localStream: null,
	remoteStream: null,
	isVideoEnabled: true,
	isAudioEnabled: true,
	callType: null, // 'video' or 'audio'
	error: null,
};

// Reducer
const webrtcReducer = (state, action) => {
	switch (action.type) {
		case 'SET_CALL_STATE':
			return { ...state, callState: action.payload };
		case 'SET_CURRENT_CALL':
			return { ...state, currentCall: action.payload };
		case 'SET_LOCAL_STREAM':
			return { ...state, localStream: action.payload };
		case 'SET_REMOTE_STREAM':
			return { ...state, remoteStream: action.payload };
		case 'SET_VIDEO_ENABLED':
			return { ...state, isVideoEnabled: action.payload };
		case 'SET_AUDIO_ENABLED':
			return { ...state, isAudioEnabled: action.payload };
		case 'SET_CALL_TYPE':
			return { ...state, callType: action.payload };
		case 'SET_ERROR':
			return { ...state, error: action.payload };
		case 'RESET_CALL':
			return {
				...initialState,
				isVideoEnabled: state.isVideoEnabled,
				isAudioEnabled: state.isAudioEnabled,
			};
		default:
			return state;
	}
};

export const WebRTCProvider = ({ children }) => {
	const [state, dispatch] = useReducer(webrtcReducer, initialState);
	const { socket } = useSocketContext();
	const { authUser } = useAuthContext();
	
	const peerConnectionRef = useRef(null);
	const localVideoRef = useRef(null);
	const remoteVideoRef = useRef(null);

	// Initialize peer connection
	const createPeerConnection = () => {
		const peerConnection = new RTCPeerConnection(rtcConfig);
		
		peerConnection.onicecandidate = (event) => {
			if (event.candidate && state.currentCall) {
				socket?.emit('call:ice-candidate', {
					to: state.currentCall.participantId,
					candidate: event.candidate,
				});
			}
		};

		peerConnection.ontrack = (event) => {
			const [remoteStream] = event.streams;
			dispatch({ type: 'SET_REMOTE_STREAM', payload: remoteStream });
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = remoteStream;
			}
		};

		peerConnection.onconnectionstatechange = () => {
			if (peerConnection.connectionState === 'connected') {
				dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.CONNECTED });
			} else if (peerConnection.connectionState === 'disconnected' || 
					   peerConnection.connectionState === 'failed') {
				endCall();
			}
		};

		return peerConnection;
	};

	// Get user media
	const getUserMedia = async (video = true, audio = true) => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: video ? { width: 640, height: 480 } : false,
				audio: audio,
			});
			
			dispatch({ type: 'SET_LOCAL_STREAM', payload: stream });
			if (localVideoRef.current) {
				localVideoRef.current.srcObject = stream;
			}
			
			return stream;
		} catch (error) {
			console.error('Error accessing media devices:', error);
			dispatch({ type: 'SET_ERROR', payload: 'Failed to access camera/microphone' });
			toast.error('Failed to access camera/microphone');
			throw error;
		}
	};

	// Initiate call
	const initiateCall = async (participantId, callType = 'video') => {
		try {
			// Prevent multiple calls
			if (state.callState !== CALL_STATES.IDLE) {
				throw new Error('Already in a call or call in progress');
			}

			console.log('Initiating call to:', participantId, 'Type:', callType);
			dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.CALLING });
			dispatch({ type: 'SET_CALL_TYPE', payload: callType });
			dispatch({ type: 'SET_CURRENT_CALL', payload: { participantId, isInitiator: true } });

			const stream = await getUserMedia(callType === 'video', true);
			peerConnectionRef.current = createPeerConnection();

			// Add local stream to peer connection
			stream.getTracks().forEach(track => {
				peerConnectionRef.current.addTrack(track, stream);
			});

			// Create offer
			const offer = await peerConnectionRef.current.createOffer();
			await peerConnectionRef.current.setLocalDescription(offer);

			// Send offer via socket
			socket?.emit('call:initiate', {
				to: participantId,
				from: authUser._id,
				offer,
				callType,
			});

			console.log('Call initiation sent via socket');

		} catch (error) {
			console.error('Error initiating call:', error);
			dispatch({ type: 'SET_ERROR', payload: 'Failed to initiate call' });
			toast.error('Failed to initiate call');
			endCall();
			throw error;
		}
	};

	// Accept incoming call
	const acceptCall = async (callData) => {
		try {
			dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.CONNECTED });
			dispatch({ type: 'SET_CALL_TYPE', payload: callData.callType });
			dispatch({ type: 'SET_CURRENT_CALL', payload: { 
				participantId: callData.from, 
				isInitiator: false 
			}});

			const stream = await getUserMedia(callData.callType === 'video', true);
			peerConnectionRef.current = createPeerConnection();

			// Add local stream to peer connection
			stream.getTracks().forEach(track => {
				peerConnectionRef.current.addTrack(track, stream);
			});

			// Set remote description
			await peerConnectionRef.current.setRemoteDescription(callData.offer);

			// Create answer
			const answer = await peerConnectionRef.current.createAnswer();
			await peerConnectionRef.current.setLocalDescription(answer);

			// Send answer via socket
			socket?.emit('call:accept', {
				to: callData.from,
				from: authUser._id,
				answer,
			});

		} catch (error) {
			console.error('Error accepting call:', error);
			dispatch({ type: 'SET_ERROR', payload: 'Failed to accept call' });
			toast.error('Failed to accept call');
			endCall();
		}
	};

	// Reject call
	const rejectCall = (callData) => {
		socket?.emit('call:reject', {
			to: callData.from,
			from: authUser._id,
		});
		dispatch({ type: 'RESET_CALL' });
	};

	// End call
	const endCall = () => {
		console.log('Ending call...');
		
		if (state.currentCall) {
			socket?.emit('call:end', {
				to: state.currentCall.participantId,
				from: authUser._id,
			});
		}

		// Close peer connection
		if (peerConnectionRef.current) {
			peerConnectionRef.current.close();
			peerConnectionRef.current = null;
		}

		// Stop local stream
		if (state.localStream) {
			state.localStream.getTracks().forEach(track => {
				track.stop();
				console.log('Stopped track:', track.kind);
			});
		}

		// Stop remote stream
		if (state.remoteStream) {
			state.remoteStream.getTracks().forEach(track => {
				track.stop();
			});
		}

		dispatch({ type: 'RESET_CALL' });
		console.log('Call ended and cleaned up');
	};

	// Toggle video
	const toggleVideo = () => {
		if (state.localStream) {
			const videoTrack = state.localStream.getVideoTracks()[0];
			if (videoTrack) {
				videoTrack.enabled = !state.isVideoEnabled;
				dispatch({ type: 'SET_VIDEO_ENABLED', payload: !state.isVideoEnabled });
			}
		}
	};

	// Toggle audio
	const toggleAudio = () => {
		if (state.localStream) {
			const audioTrack = state.localStream.getAudioTracks()[0];
			if (audioTrack) {
				audioTrack.enabled = !state.isAudioEnabled;
				dispatch({ type: 'SET_AUDIO_ENABLED', payload: !state.isAudioEnabled });
			}
		}
	};

	// Socket event listeners
	useEffect(() => {
		if (!socket) return;

		const handleIncomingCall = (callData) => {
			console.log('Incoming call received:', callData);
			
			// Prevent incoming call if already in a call
			if (state.callState !== CALL_STATES.IDLE) {
				console.log('Rejecting incoming call - already in call');
				socket?.emit('call:reject', {
					to: callData.from,
					from: authUser._id,
				});
				return;
			}

			dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.INCOMING });
			dispatch({ type: 'SET_CURRENT_CALL', payload: { 
				...callData, 
				participantId: callData.from,
				isInitiator: false 
			}});
			dispatch({ type: 'SET_CALL_TYPE', payload: callData.callType });
			
			toast.success(`Incoming ${callData.callType} call`);
		};

		const handleCallAccepted = async (data) => {
			try {
				if (peerConnectionRef.current) {
					await peerConnectionRef.current.setRemoteDescription(data.answer);
					dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.CONNECTED });
				}
			} catch (error) {
				console.error('Error handling call accepted:', error);
				endCall();
			}
		};

		const handleCallRejected = () => {
			toast.error('Call was rejected');
			dispatch({ type: 'RESET_CALL' });
		};

		const handleCallEnded = () => {
			toast.info('Call ended');
			endCall();
		};

		const handleIceCandidate = async (data) => {
			try {
				if (peerConnectionRef.current && data.candidate) {
					await peerConnectionRef.current.addIceCandidate(data.candidate);
				}
			} catch (error) {
				console.error('Error adding ICE candidate:', error);
			}
		};

		socket.on('call:incoming', handleIncomingCall);
		socket.on('call:accepted', handleCallAccepted);
		socket.on('call:rejected', handleCallRejected);
		socket.on('call:ended', handleCallEnded);
		socket.on('call:ice-candidate', handleIceCandidate);

		return () => {
			socket.off('call:incoming', handleIncomingCall);
			socket.off('call:accepted', handleCallAccepted);
			socket.off('call:rejected', handleCallRejected);
			socket.off('call:ended', handleCallEnded);
			socket.off('call:ice-candidate', handleIceCandidate);
		};
	}, [socket, state.currentCall]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			endCall();
		};
	}, []);

	const value = {
		...state,
		initiateCall,
		acceptCall,
		rejectCall,
		endCall,
		toggleVideo,
		toggleAudio,
		localVideoRef,
		remoteVideoRef,
		CALL_STATES,
	};

	return (
		<WebRTCContext.Provider value={value}>
			{children}
		</WebRTCContext.Provider>
	);
};
