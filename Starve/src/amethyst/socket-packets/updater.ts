import { getObjectProperty, PROPS, VARS } from "@/core";
import { getSocket } from "../socket";
import { globalObject, isArray, smoothTween } from "@/core/utils";
import { GLOBAL, UNITS } from "@/core/constants";
import { socketJoinRoom, socketLeaveRoom } from "./room";
import { getLocalAlive, getLocalPlayer } from "@/core/hooks";
import type { AmethystPlayer } from "../components";
import { getDelta } from "@/core/modules";

function getWSPath(url: string): string {
  const protocolEndIndex = url.indexOf('://') + 3;
  const firstSlashIndex = url.indexOf('/', protocolEndIndex);

  if (firstSlashIndex === -1)
    return '';

  const [ a, b ] = url.substring(firstSlashIndex).replace('/', '').split('?');

  return a;
}

export function socketUpdatePlayers(players: any[]) {
  if (!getLocalAlive()) return;

  const realtime = GLOBAL.AMETHYST_PLAYERS as AmethystPlayer[];

  // Retrieve all units from the game world
  const units = VARS.WORLD[PROPS.UNITS];
  if (!isArray(units) || units.length === 0) return;

  // Retrieve the array of player units from the units
  const world_players = units[UNITS.PLAYERS];
  if (!isArray(world_players) || !world_players) return;

  const world_len = world_players.length;
  if (world_len === 0) return;

  for (const pid in realtime) {
    const player = players.find((p: { [x: string]: any; }) => p && p.gpid === globalObject.Number(pid));
    const world_player = world_players.find((p: { [x: string]: any; }) => p && p[getObjectProperty(p, 'UNIT_PID', 2)!] === globalObject.Number(pid));

    if (player && world_player) {
      const obj = realtime[pid] as AmethystPlayer;

      obj.updateInfo(player);
      // obj.water = player.water;
      // obj.health = player.health;
      // obj.hunger = player.hunger;
      // obj.temperature = player.temperature;
      // console.log('player', player, 'obj', obj);

      // for (let i = 0; i < props.length; i++) {
      //   const prop = props[i];
      //   if (obj[prop]) smoothTween(player[prop], obj[prop], getDelta(), function(v: number) { obj[prop] = v; }) 
      // }
    }
  }
}

export function socketUpdater(type: number): void {
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

      const water = VARS.USER[PROPS.GAUGES][getObjectProperty(VARS.USER[PROPS.GAUGES], 'USER_GAUGES_T', 4)!] * 100;
      const health = VARS.USER[PROPS.GAUGES][getObjectProperty(VARS.USER[PROPS.GAUGES], 'USER_GAUGES_L', 2)!] * 100;
      const hunger = VARS.USER[PROPS.GAUGES][getObjectProperty(VARS.USER[PROPS.GAUGES], 'USER_GAUGES_H', 3)!] * 100;
      const temperature = VARS.USER[PROPS.GAUGES][getObjectProperty(VARS.USER[PROPS.GAUGES], 'USER_GAUGES_C', 1)!] * 100;

      socket.emit('info', [x, y, health, hunger, temperature, water]);
      break;
    }
  }
}