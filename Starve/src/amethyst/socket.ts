import { GLOBAL } from "@/core/constants";
import { socketConnected, socketHandshaked, socketPlayerJoin, socketPlayerLeft, socketUpdatePlayers, socketUpdater } from "./socket-packets";

import { type ManagerOptions, type Socket, type SocketOptions, io } from "socket.io-client";

const SOCKET_EVENTS: any[] = [
  ['leave', function () {
    if (GLOBAL.SOCKET_CURRENT_ROOM !== undefined)
      GLOBAL.SOCKET_CURRENT_ROOM = undefined;
  }],
  ['update', socketUpdater],
  ['connect', socketConnected],
  ['handshaked', socketHandshaked],
  ['update.players', socketUpdatePlayers],
  ['player.join', socketPlayerJoin],
  ['player.left', socketPlayerLeft]
];
const SOCKET_OPTIONS: Partial<ManagerOptions & SocketOptions> = {
  ['transports']: ['websocket']
};
const SOCKET_EVENTS_LENGTH = SOCKET_EVENTS.length;

let socket: Socket | undefined = undefined;
let initialized: boolean = false;

export function getSocket(): Socket | undefined {
  if (isSocketReady())
    return socket;

  return undefined;
}

export function isSocketReady(): boolean {
  return initialized && !!socket;
}

export function destroySocket(): void {
  if (!isSocketReady())
    return;

  socket!.disconnect();

  for (let index: number = 0; index < SOCKET_EVENTS_LENGTH; index++) {
    const event = SOCKET_EVENTS[index];

    if (event) {
      const [name] = event;
      socket!.off(name);
    }
  }

  socket = undefined;
}

export async function initializeSocket(): Promise<void> {
  if (isSocketReady())
    return;

  const protocol = GLOBAL.API_HOST.includes('localhost') ? 'http://' : 'https://';

  socket = io(protocol + GLOBAL.API_HOST, SOCKET_OPTIONS) as Socket;

  for (let index: number = 0; index < SOCKET_EVENTS_LENGTH; index++) {
    const event = SOCKET_EVENTS[index];
    if (event) {
      const [name, fn] = event;
      socket.on(name, fn);
    }
  }

  initialized = true;
}