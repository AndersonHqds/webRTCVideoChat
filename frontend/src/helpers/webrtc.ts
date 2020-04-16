export default {
  peerConnection: window.RTCPeerConnection || window.webkitRTCPeerConnection,
  sessionDescription: window.RTCSessionDescription,
};
