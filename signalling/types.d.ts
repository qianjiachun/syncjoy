import { WebSocket } from "ws";
export interface IRoom {
  rid: string;
  users: Record<string, IUser>;
}

export interface IUser {
  uid: string;
  ws: WebSocket;
  heartbeatTime: number; // 上一次心跳包时间
}

export type IMessageType = "join" | "offer" | "answer" | "candidate" | "leave" | "heartbeat";

export interface IMessage {
  type: IMessageType;
  data: IJoin | ILeave;
}

export interface IJoin {
  rid: string;
}

export interface ILeave {
  uid: string;
}

export type IMessageWebRTC = { fromUid: string; toUid: string } & any;
