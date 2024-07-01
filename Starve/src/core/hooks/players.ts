import { globalObject, isArray } from '@/core/utils';
import { UNITS } from '@/core/constants';
import { PROPS, VARS, getObjectProperty } from '@/core';

let STORED_PLAYERS: any[] = [];

export function getLocalPlayer() {
  if (VARS.USER[PROPS.ALIVE] || (VARS.CLIENT[PROPS.SOCKET] && VARS.CLIENT[PROPS.SOCKET]['readyState'] === globalObject.WebSocket.OPEN))
    return VARS.WORLD[PROPS.FAST_UNITS][VARS.USER[PROPS.UID]];

  return undefined;
}

export function getPlayerByPid(pid: number) {
  return STORED_PLAYERS.find(player => player && player.pid === pid);
}

export function updatePlayers() {
  const sl = STORED_PLAYERS.length;

  if (!VARS.USER[PROPS.ALIVE]) {
    if (sl > 0)
      STORED_PLAYERS = [];

    return;
  }

  const FAST_UNITS = VARS.WORLD[PROPS.FAST_UNITS];
  if (!isArray(FAST_UNITS) || FAST_UNITS.length === 0) return;

  const ful = FAST_UNITS.length;

  for (let i = 0; i < ful; i++) {
    const FAST_UNIT = FAST_UNITS[i];

    if (FAST_UNIT) {
      const type = FAST_UNIT[getObjectProperty(FAST_UNIT, 'UNIT_TYPE', 1)!];
      if (type !== UNITS.PLAYERS) continue;

      const pid = FAST_UNIT[getObjectProperty(FAST_UNIT, 'UNIT_PID', 2)!];
      if (!getPlayerByPid(pid)) STORED_PLAYERS.push({ pid });

      const obj = FAST_UNIT[getObjectProperty(FAST_UNIT, 'UNIT_OBJ', 14)!];
      if (obj) {
        const player = getPlayerByPid(pid);

        player.nickname = obj[getObjectProperty(obj, 'PLAYER_NICKNAME', 1)!];
      }
    }
  }
}