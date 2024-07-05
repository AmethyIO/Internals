import { GLOBAL } from "@/core/constants";
import { getSocket } from "../socket";
import { getLocalId } from "@/core/hooks";
import { sleep } from "@/core/utils";

function socketJoinedRoom(room: string): void {
  const socket = getSocket();
  if (!socket) return;

  if (GLOBAL.SOCKET_CURRENT_ROOM === undefined)
    GLOBAL.SOCKET_CURRENT_ROOM = room;
}

export function socketLeaveRoom(): void {
  const socket = getSocket();
  if (!socket) return;

  socket.emit('leave');
}

export async function socketJoinRoom(room: string): Promise<void> {
  const socket = getSocket();
  if (!socket) return;

  if (GLOBAL.SOCKET_CURRENT_ROOM !== undefined)
    return;

  while (GLOBAL.SOCKET_CURRENT_ROOM === undefined) {
    await sleep(50);

    const id = getLocalId();
    if (id !== 0) {
      socket.emit('join', [room, id]);
      break;
    }
  }

  socket.once('joined', socketJoinedRoom)
}