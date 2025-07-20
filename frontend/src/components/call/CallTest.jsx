import { useWebRTC } from '../../context/WebRTCContext';

const CallTest = () => {
	const { callState, CALL_STATES } = useWebRTC();
	
	return (
		<div className="p-4 bg-gray-100 rounded-lg">
			<h3>WebRTC Status: {callState}</h3>
			<p>Available states: {Object.values(CALL_STATES).join(', ')}</p>
		</div>
	);
};

export default CallTest;
