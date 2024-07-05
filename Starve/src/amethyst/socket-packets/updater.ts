import { getObjectProperty, PROPS, VARS } from "@/core";
import { getSocket } from "../socket";
import { globalObject } from "@/core/utils";
import { GLOBAL } from "@/core/constants";
import { socketJoinRoom, socketLeaveRoom } from "./room";
import { getLocalAlive, getLocalPlayer } from "@/core/hooks";

function getWSPath(url: string): string {
  const protocolEndIndex = url.indexOf('://') + 3;
  const firstSlashIndex = url.indexOf('/', protocolEndIndex);

  if (firstSlashIndex === -1)
    return '';

  return url.substring(firstSlashIndex).replace('/', '');
}

export function socketUpdater(type: any): void {
  const socket = getSocket();
  if (!socket) return;

  switch (type) {
    case 1: {
      const HAS_GAME_SOCKET = VARS.CLIENT[PROPS.SOCKET] && VARS.CLIENT[PROPS.SOCKET] !== null;
      if (HAS_GAME_SOCKET) {
        const url = VARS.CLIENT[PROPS.SOCKET]['url'];
        const roomPath = getWSPath(url);
        const connected = VARS.CLIENT[PROPS.SOCKET]['readyState'] === globalObject.WebSocket.OPEN;

        if (connected && GLOBAL.SOCKET_CURRENT_ROOM !== roomPath)
          socketJoinRoom(roomPath);
       
        if (!connected && GLOBAL.SOCKET_CURRENT_ROOM !== undefined)
          socketLeaveRoom();
      }
      break;
    }

    case 2: {
      if (!getLocalAlive()) return;

      const player = getLocalPlayer();
      if (!player) return;

      const x = player[getObjectProperty(player, 'UNIT_X', 4)!];
      const y = player[getObjectProperty(player, 'UNIT_Y', 5)!];
      const health = VARS.USER[PROPS.GAUGES][getObjectProperty(VARS.USER[PROPS.GAUGES], 'USER_GAUGES_L', 2)!] * 100;

      socket.emit('info', [x, y, health]);
      break;
    }
  }
}