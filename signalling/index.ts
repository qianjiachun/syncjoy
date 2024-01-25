/// <reference path="types.d.ts" />
import fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import { ulid } from "ulid";
import { IUser, IJoin, IMessage, IRoom, ILeave, IMessageWebRTC } from "./types";
import { RawData } from "ws";
const server = fastify();
server.register(fastifyWebsocket);

// 心跳检测间隔
const HEARTBEAT_INTERVAL = 5 * 60 * 1000;
// 所有房间
const rooms: Map<string, IRoom> = new Map();
// 用户uid对应房间rid
const userRoomMap: Record<string, string> = {};

function handleUserMessage(user: IUser, msg: RawData) {
  let message: IMessage | null = null;
  try {
    message = JSON.parse(msg.toString());
  } catch (err) {
    server.log.error(err);
    message = null;
  }
  if (!message) return;
  if (message.type === "heartbeat") handleHeartbeat(user);
  if (["offer", "answer", "candidate"].includes(message.type)) handleUserWebRTC(user, message);
  if (message.type === "join") handleJoin(user, message.data as IJoin);
  if (message.type === "leave") userLeave((message.data as ILeave).uid);
}

function handleHeartbeat(user: IUser) {
  user.heartbeatTime = new Date().getTime();
}

function handleUserWebRTC(user: IUser, data: IMessageWebRTC) {
  // 信令交换
  broadcastToUid(data.toUid, { ...data, fromUid: user.uid });
}

function handleJoin(user: IUser, data: IJoin) {
  if (!rooms.has(data.rid)) rooms.set(data.rid, { rid: data.rid, users: {} });
  const uid = user.uid;
  const rid = data.rid;

  const room = rooms.get(rid) as IRoom;
  room.users[uid] = user;
  userRoomMap[uid] = rid;
  // 用户进入房间后返回该用户的uid和该房间内的所有用户uid
  user.ws.send(JSON.stringify({ type: "login", data: { uid: user.uid, rid, roomUids: Object.keys(room.users) } }));
  // 向该房间内的其他用户广播该用户加入房间的消息，并且返回当前房间内的所有用户uid
  broadcastToRoom(rid, { type: "joined", data: { rid, uid } }, [uid]);
}

function userLeave(uid: string) {
  const rid = userRoomMap[uid];
  if (!rid) return;
  delete userRoomMap[uid];
  const room = rooms.get(rid) as IRoom;
  delete room.users[uid];
  broadcastToRoom(rid, { type: "leave", data: { rid, uid: uid } }, [uid]);
  if (Object.keys(room.users).length === 0) rooms.delete(rid);
}

// 向指定rid的房间广播消息
function broadcastToRoom(rid: string, data: any, excludeUids?: string[]) {
  const room = rooms.get(rid) as IRoom;
  for (const key in room.users) {
    if (excludeUids && excludeUids.includes(room.users[key].uid)) continue;
    room.users[key].ws.send(JSON.stringify(data));
  }
}

// 向指定的uid发送消息
function broadcastToUid(uid: string, data: any) {
  if (!userRoomMap[uid]) return;
  const rid = userRoomMap[uid];
  const room = rooms.get(rid) as IRoom;
  const user = room.users[uid];
  user.ws.send(JSON.stringify(data));
}

setInterval(() => {
  let leaveUsers: IUser[] = [];
  const now = new Date().getTime();
  for (const key in rooms) {
    const room = rooms.get(key) as IRoom;
    for (const uid in room.users) {
      const user = room.users[uid];
      if (now - user.heartbeatTime > HEARTBEAT_INTERVAL) {
        leaveUsers.push(user);
      }
    }
  }
  for (const user of leaveUsers) {
    user.ws.terminate();
  }
}, HEARTBEAT_INTERVAL);

server.register(async () => {
  server.get("/signalling", { websocket: true }, (connection) => {
    const user: IUser = { uid: ulid(), ws: connection.socket, heartbeatTime: new Date().getTime() };
    connection.socket.on("message", (msg) => handleUserMessage(user, msg));
    connection.socket.on("close", () => userLeave(user.uid));
  });
});

server.listen({ port: 7010 }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
