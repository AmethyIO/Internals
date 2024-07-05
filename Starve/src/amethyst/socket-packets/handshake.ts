import { GLOBAL } from "@/core/constants";
import { getSocket } from "../socket";
import { getPublicKey } from "../key";

export function socketConnected(): void {
  const socket = getSocket();
  if (!socket) return;

  if (GLOBAL.SOCKET_CURRENT_ROOM !== undefined)
    GLOBAL.SOCKET_CURRENT_ROOM = undefined;

  socket.emit('handshake', getPublicKey());
}

export function socketHandshaked([uuid = '', servers = []]): void {
  const socket = getSocket();
  if (!socket) return;

  GLOBAL.SOCKET_UUID = uuid;
  GLOBAL.SOCKET_AVAILABLE_ROOMS = servers;

  console.log('socket successfully handshaked', JSON.stringify({ uuid, servers }));
}