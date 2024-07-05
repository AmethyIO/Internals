import { GLOBAL } from "@/core/constants";
import { globalObject, sleep } from "@/core/utils";
import { socketConnected, socketHandshaked, socketUpdater } from "./socket-packets";

import { type ManagerOptions, type Socket, type SocketOptions } from "socket.io-client";

const SOCKET_EVENTS: any[] = [
  ['update', socketUpdater],
  ['leave', function() {
    if (GLOBAL.SOCKET_CURRENT_ROOM !== undefined)
      GLOBAL.SOCKET_CURRENT_ROOM = undefined;
  }],
  ['connect', socketConnected],
  ['handshaked', socketHandshaked],
];
const SOCKET_OPTIONS: Partial<ManagerOptions & SocketOptions> = {
  ['transports']: ['websocket']
};
const SOCKET_EVENTS_LENGTH = SOCKET_EVENTS.length;

let _ready: boolean = false;
let socket: Socket | undefined = undefined;
let initialized: boolean = false;

export function getSocket(): Socket | undefined {
  if (isSocketReady())
    return socket;

  return undefined;
}

export function isSocketReady(): boolean {
  return _ready && initialized && !!socket;
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

  while (!_ready) {
    await sleep(50);

    if ('io' in globalObject) {
      const protocol = GLOBAL.API_HOST.includes('localhost') ? 'http://' : 'https://';

      socket = (globalObject as any).io(protocol + GLOBAL.API_HOST, SOCKET_OPTIONS) as Socket;

      console.log(protocol + GLOBAL.API_HOST);

      for (let index: number = 0; index < SOCKET_EVENTS_LENGTH; index++) {
        const event = SOCKET_EVENTS[index];
        if (event) {
          const [name, fn] = event;
          socket.on(name, fn);
        }
      }

      _ready = true;
    }
  }

  initialized = true;
}