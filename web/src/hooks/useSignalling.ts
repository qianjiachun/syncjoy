import { ref } from "vue";

// const signallingServerUrl = "ws://localhost:7010/signalling";
const signallingServerUrl = "wss://sb.douyuex.com/signalling";

const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: ["stun:api.crossdesk.cn:3478"] },
    { urls: ["turn:api.crossdesk.cn:3478"], username: "crossdesk", credential: "crossdeskpw" },
    {
      urls: "turn:turn.fsharechat.cn:3478",
      username: "comsince",
      credential: "comsince"
    }
  ]
};

export const useSignalling = () => {
  const server = ref<WebSocket>(new WebSocket(signallingServerUrl));
  const isServerConnected = ref(false);
  const connections = ref<Record<string, IConnection>>({});
  const myUid = ref<string>("");
  const onMessageCallback = ref<(msg: string) => void>();
  let heartbeatTimer: number | null = null;
  const candidateQueue: Record<string, RTCIceCandidateInit[]> = {};

  const processCandidateQueue = async (uid: string) => {
    if (candidateQueue[uid] && connections.value[uid]) {
      for (const candidate of candidateQueue[uid]) {
        await connections.value[uid].peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
      }
      candidateQueue[uid] = [];
    }
  };

  const handleSDPOffer = async (msg: IMessageWebRTC) => {
    const uid = msg.fromUid;
    await connections.value[uid].peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
    await processCandidateQueue(uid);

    const answer = await connections.value[uid].peerConnection.createAnswer();

    await connections.value[uid].peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    server.value.send(JSON.stringify({ ...connections.value[uid].peerConnection.localDescription!.toJSON(), toUid: uid }));
  };

  const handleSDPAnswer = async (msg: IMessageWebRTC) => {
    const uid = msg.fromUid;
    await connections.value[uid].peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
    await processCandidateQueue(uid);
  };

  const handleCandidate = (msg: IMessageWebRTC) => {
    const uid = msg.fromUid;
    if (!connections.value[uid]) return;
    const pc = connections.value[uid].peerConnection;
    if (!pc.remoteDescription) {
      if (!candidateQueue[uid]) candidateQueue[uid] = [];
      candidateQueue[uid].push(msg.data);
    } else {
      pc.addIceCandidate(new RTCIceCandidate(msg.data)).catch(console.error);
    }
  };

  // 初始化webrtc连接
  const initConnection = (uid: string, isOfferer: boolean = false) => {
    if (connections.value[uid]) return;
    const peerConnection = new RTCPeerConnection(rtcConfig);
    connections.value[uid] = { peerConnection: peerConnection as any, dataChannel: null as any };

    if (isOfferer) {
      const dataChannel = peerConnection.createDataChannel(`dataChannel-${uid}`);
      connections.value[uid].dataChannel = dataChannel;
      dataChannel.onmessage = handleMessage;
    } else {
      peerConnection.ondatachannel = (event) => {
        connections.value[uid].dataChannel = event.channel;
        connections.value[uid].dataChannel.onmessage = handleMessage;
      };
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) server.value.send(JSON.stringify({ type: "candidate", data: event.candidate, toUid: uid }));
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed") {
        handleLeave({ uid });
      }
    };
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
    try {
      const offer = await connections.value[uid].peerConnection.createOffer();
      await connections.value[uid].peerConnection.setLocalDescription(offer);
      server.value.send(JSON.stringify({ ...connections.value[uid].peerConnection.localDescription!.toJSON(), toUid: uid }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleServerConnection = () => {
    isServerConnected.value = true;
    heartbeatTimer = window.setInterval(
      () => {
        if (server.value.readyState === WebSocket.OPEN) {
          server.value.send(JSON.stringify({ type: "heartbeat" }));
        }
      },
      4 * 60 * 1000
    );
  };

  const handleServerClose = () => {
    isServerConnected.value = false;
    myUid.value = "";
    if (heartbeatTimer) clearInterval(heartbeatTimer);
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
      initConnection(uid, true);
      createOffer(uid);
    }
  };

  const handleJoined = (join: IJoin) => {
    initConnection(join.uid, false);
  };

  const handleLeave = (msg: ILeave) => {
    const uid = msg.uid;
    if (!connections.value[uid]) return;
    connections.value[uid].peerConnection.close();
    if (connections.value[uid].dataChannel) {
      connections.value[uid].dataChannel.close();
    }
    delete connections.value[uid];
    if (candidateQueue[uid]) delete candidateQueue[uid];
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
