interface IRoomInfo {
  rid: string; // 房间号
  uid: string; // 用户id
  roomUids: string[]; // 房间内所有uid
}

interface IJoin {
  uid: string;
  rid: string;
}

interface ILeave {
  uid: string;
}

interface IConnection {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
}

type IMessageWebRTC = { fromUid: string; toUid: string } & RTCSessionDescriptionInit & { data: RTCIceCandidateInit };

interface IGamepadConfig {
  gamepad: { img: string };
  buttons: {
    a: IGamepadConfigItem;
    b: IGamepadConfigItem;
    x: IGamepadConfigItem;
    y: IGamepadConfigItem;
  };
  bumper: {
    left: IGamepadConfigItem;
    right: IGamepadConfigItem;
  };
  triggers: {
    left: IGamepadConfigItem;
    right: IGamepadConfigItem;
  };
  stick: {
    left: IGamepadConfigItem;
    right: IGamepadConfigItem;
  };
  dpad: {
    up: IGamepadConfigItem;
    down: IGamepadConfigItem;
    left: IGamepadConfigItem;
    right: IGamepadConfigItem;
  };
  back: IGamepadConfigItem;
  start: IGamepadConfigItem;
}

interface IGamepadConfigItem {
  img: string;
  imgActive: string;
  top: number;
  left: number;
  scale: number;
  angle: number;
}

type IGamepadInputState = number[][];
type IMessageType = "input" | "config" | "need_config";

interface IMessage<T> {
  type: IMessageType;
  uid: string;
  data: T;
}

interface IRemoteGamepad {
  uid: string;
  config?: IGamepadConfig;
  inputState?: IGamepadInputState;
}
