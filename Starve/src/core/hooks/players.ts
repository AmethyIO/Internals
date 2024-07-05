import { globalObject, isArray } from '@/core/utils';
import { UNITS } from '@/core/constants';
import { PROPS, VARS, getObjectProperty } from '@/core';

let STORED_PLAYERS: any[] = [];

/**
 * Checks if the local user is alive or the WebSocket connection is open.
 *
 * @returns True if the user is alive or the WebSocket connection is open, otherwise false.
 */
export function getLocalAlive() {
  return VARS.USER[PROPS.ALIVE] && (VARS.CLIENT[PROPS.SOCKET] && VARS.CLIENT[PROPS.SOCKET]['readyState'] === globalObject.WebSocket.OPEN);
}

/**
 * Retrieves the UID of the local user.
 *
 * @returns The UID if the user is alive or the WebSocket connection is open, otherwise 0.
 */
export function getLocalUid() {
  if (getLocalAlive()) {
    if (typeof VARS.USER[PROPS.UID] !== 'undefined')
      return VARS.USER[PROPS.UID];

    return getLocalId() * VARS.WORLD[PROPS.MAX_UNITS];
  }

  return 0;
}

/**
 * Retrieves the local player object from the game world.
 *
 * @returns The local player object if available, otherwise undefined.
 */
export function getLocalPlayer() {
  if (getLocalAlive()) {
    if (VARS.WORLD[PROPS.FAST_UNITS])
      return VARS.WORLD[PROPS.FAST_UNITS][getLocalUid()];
    else {
      if (VARS.WORLD[PROPS.UNITS]) {
        let p = getPlayerByPid(getLocalId());
        if (p) {
          const ps = VARS.WORLD[PROPS.UNITS][UNITS.PLAYERS];
          const psl = ps.length;

          for (let i = 0; i < psl; i++) {
            const o = ps[i];
            if (o) {
              const pid = o[getObjectProperty(o, 'UNIT_PID', 2)!];
              if (pid === p.pid) {
                p = o;
                break;
              }
            }
          }

          return p;
        }
      }
    }
  }

  return undefined;
}

/**
 * Retrieves the ID of the local user.
 *
 * @returns The ID if the user is alive or the WebSocket connection is open, otherwise 0.
 */
export function getLocalId() {
  if (getLocalAlive())
    return VARS.USER[PROPS.ID];

  return 0;
}

/**
 * Retrieves a player object by their player ID (pid).
 *
 * @param pid - The player ID.
 * @returns The player object if found, otherwise undefined.
 */
export function getPlayerByPid(pid: number) {
  return STORED_PLAYERS.find(player => player && player.pid === pid);
}

/**
 * Updates the list of stored players with information from the game world.
 * Removes stored players if the user is not alive.
 */
export function updatePlayers() {
  const sl = STORED_PLAYERS.length;

  if (!getLocalAlive()) {
    if (sl > 0) {
      STORED_PLAYERS = [];
    }
    return;
  }

  const FAST_UNITS = VARS.WORLD[PROPS.FAST_UNITS];
  if (!isArray(FAST_UNITS) || FAST_UNITS.length === 0) return;

  const ful = FAST_UNITS.length;

  // Loop through fast units to update stored players.
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
