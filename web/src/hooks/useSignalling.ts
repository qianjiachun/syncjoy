import { ref } from "vue";

// const signallingServerUrl = "ws://localhost:7010/signalling";
const signallingServerUrl = "wss://sb.douyuex.com/signalling";

const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:turn.fsharechat.cn:3478",
      username: "comsince",
      credential: "comsince"
    },
    {
      urls: "turn:freeturn.net:3478",
      username: "free",
      credential: "free"
    }
  ]
};

export const useSignalling = () => {
  const server = ref<WebSocket>(new WebSocket(signallingServerUrl));
  const isServerConnected = ref(false);
  const connections = ref<Record<string, IConnection>>({});
  const myUid = ref<string>("");
  const onMessageCallback = ref<(msg: string) => void>();

  const handleSDPOffer = async (msg: IMessageWebRTC) => {
    const uid = msg.fromUid;
    await connections.value[uid].peerConnection.setRemoteDescription(new RTCSessionDescription(msg));

    const answer = await connections.value[uid].peerConnection.createAnswer();

    await connections.value[uid].peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    server.value.send(JSON.stringify({ ...connections.value[uid].peerConnection.localDescription!.toJSON(), toUid: uid }));
  };

  const handleSDPAnswer = (msg: IMessageWebRTC) => {
    connections.value[msg.fromUid].peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
  };

  const handleCandidate = (msg: IMessageWebRTC) => {
    connections.value[msg.fromUid].peerConnection.addIceCandidate(new RTCIceCandidate(msg.data));
  };

  // 初始化webrtc连接
  const initConnection = (uid: string) => {
    if (connections.value[uid]) return;
    const peerConnection = new RTCPeerConnection(rtcConfig);
    const dataChannel = peerConnection.createDataChannel(`dataChannel-${uid}`);
    connections.value[uid] = { peerConnection: peerConnection as any, dataChannel: dataChannel };
    connections.value[uid].peerConnection.onicecandidate = (event) => {
      if (event.candidate) server.value.send(JSON.stringify({ type: "candidate", data: event.candidate, toUid: uid }));
    };
    connections.value[uid].peerConnection.ondatachannel = (event) => (connections.value[uid].dataChannel = event.channel);
    connections.value[uid].dataChannel.onmessage = handleMessage;
  };

  const handleMessageFromServer = (event: { data: string }) => {
    let msg = null;
    try {
      msg = JSON.parse(event.data);
    } catch (error) {
      console.log(error);
      return;
    }
    if (!msg.type) return;
    switch (msg.type) {
      case "login":
        handleLogin(msg.data);
        break;
      case "joined":
        handleJoined(msg.data);
        break;
      case "offer":
        handleSDPOffer(msg);
        break;
      case "answer":
        handleSDPAnswer(msg);
        break;
      case "candidate":
        handleCandidate(msg);
        break;
      case "leave":
        handleLeave(msg.data);
        break;
      default:
        break;
    }
  };

  const createOffer = async (uid: string) => {
    connections.value[uid].peerConnection.onnegotiationneeded = async () => {
      const offer = await connections.value[uid].peerConnection.createOffer();
      await connections.value[uid].peerConnection.setLocalDescription(offer);
      server.value.send(JSON.stringify({ ...connections.value[uid].peerConnection.localDescription!.toJSON(), toUid: uid }));
    };
  };

  const handleServerConnection = () => {
    isServerConnected.value = true;
    setInterval(() => {
      server.value.send(JSON.stringify({ type: "heartbeat" }));
    }, 4 * 60 * 1000);
  };

  const handleServerClose = () => {
    isServerConnected.value = false;
    myUid.value = "";
    server.value.send(JSON.stringify({ type: "leave", data: { uid: myUid.value } }));
  };

  server.value.onopen = handleServerConnection;
  server.value.onmessage = handleMessageFromServer;
  server.value.onclose = handleServerClose;

  const joinRoom = (rid: string) => {
    if (!isServerConnected.value) return;
    server.value.send(JSON.stringify({ type: "join", data: { rid } }));
  };

  const handleLogin = (roomInfo: IRoomInfo) => {
    myUid.value = roomInfo.uid;
    if (roomInfo.roomUids.length <= 1) return;
    for (const uid of roomInfo.roomUids) {
      if (uid === myUid.value) continue;
      initConnection(uid);
      createOffer(uid);
    }
  };

  const handleJoined = (join: IJoin) => {
    initConnection(join.uid);
  };

  const handleLeave = (msg: ILeave) => {
    const uid = msg.uid;
    if (!connections.value[uid]) return;
    connections.value[uid].peerConnection.close();
    connections.value[uid].dataChannel.close();
    delete connections.value[uid];
    onUserLeaveCallback.value && onUserLeaveCallback.value(uid);
  };

  const sendMessage = (message: string) => {
    for (const uid in connections.value) {
      if (myUid.value === uid) continue;
      try {
        connections.value[uid].dataChannel.send(message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMessage = (msg: { data: string }) => {
    onMessageCallback.value && onMessageCallback.value(msg.data);
  };

  const onMessage = (callback: (msg: string) => void) => {
    onMessageCallback.value = callback;
  };

  const onUserLeave = (callback: (uid: string) => void) => {
    onUserLeaveCallback.value = callback;
  };

  const onUserLeaveCallback = ref<(uid: string) => void>();

  return {
    isServerConnected,
    myUid,
    joinRoom,
    sendMessage,
    onMessage,
    onUserLeave
  };
};
