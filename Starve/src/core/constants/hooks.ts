import type { Hook } from '@/core/types/interfaces';
import { globalObject, isArray } from '@/core/utils';
import { getVarProperty, setHookedVar } from '@/core';

export const BASE = globalObject.Symbol();

export const BASE_HOOKS: [string, Hook][] = [
  ['IDLE', { // Mouse hook
    ['get']: function () { return (this as any)[BASE] },
    ['set']: function (data: any) {
      (this as any)[BASE] = data;
      setHookedVar('MOUSE', this);
    }
  }],
  ['time', { // World hook
    ['get']: function () { return (this as any)[BASE] },
    ['set']: function (data: any) {
      (this as any)[BASE] = data;
      setHookedVar('WORLD', this);
    }
  }],
  ['options', { // Game hook
    ['get']: function () { return (this as any)[BASE] },
    ['set']: function (data: any) {
      (this as any)[BASE] = data;
      setHookedVar('GAME', this);
    }
  }],
  ['ping', { // NetworkClient hook
    ['get']: function () { return (this as any)[BASE] },
    ['set']: function (data: any) {
      (this as any)[BASE] = data;
      setHookedVar('CLIENT', this);
    }
  }],
  ['reconnect', { // User hook
    ['get']: function () { return (this as any)[BASE] },
    ['set']: function (data: any) {
      (this as any)[BASE] = data;
      setHookedVar('USER', this);
    }
  }],
  ['opacity', { ['get']: function() { return 0.25 } }],
  ['isBlocked', { ['get']: function () { return false } }], // Ads again..
];

export const PROP_HOOKS = [
  // User hooks
  ['USER',    'ID',            16],
  ['USER',    'UID',           17],
  ['USER',    'TEAM',          21],
  ['USER',    'CHAT',          43],
  ['USER',    'GHOST',          7],
  ['USER',    'TOTEM',         24],
  ['USER',    'CRAFT',         38],
  ['USER',    'ALIVE',         11],
  ['USER',    'GHOST',         65],
  ['USER',    'CAMERA',        28],
  ['USER',    'GAUGES',        30],
  ['USER',    'CONTROL',       29],
  ['USER',    'IN_TEAM',       22],
  ['USER',    'TERMINAL',      42],
  ['USER',    'INVENTORY',     35],

  // Mouse hooks
  ['MOUSE',   'POS',            5],
  ['MOUSE',   'STATE',          9],

  // World hooks
  ['WORLD',   'MODE',           1],
  ['WORLD',   'UNITS',          6],
  ['WORLD',   'PLAYERS',        5],
  ['WORLD',   'MAX_UNITS',      2],
  ['WORLD',   'FAST_UNITS',     7],

  // NetworkClient hooks
  ['CLIENT',  'SOCKET',         1],
  ['CLIENT',  'SEND_CHAT',      96],
  ['CLIENT',  'SELECT_CRAFT',   97],
  ['CLIENT',  'SELECT_INV',     114],
  ['CLIENT',  'STOP_ATTACK',    121],
  ['CLIENT',  'SEND_ATTACK',    122],
  ['CLIENT',  'SEND_ANGLE',     123],
  ['CLIENT',  'SEND_MOVE',      124]
];

export function hookAllProperties(): void {
  const length = PROP_HOOKS.length;

  for (let index: number = 0; index < length; index++) {
    const hookProp = PROP_HOOKS[index];

    if (hookProp && isArray(hookProp)) {
      const [variable, property, address] = hookProp;

      const hooked = getVarProperty(
        variable as string,
        property as string,
        address as number
      );

      if (!!hooked) console.log(`found ${variable}.${property} in address ${address} (${hooked})`);
    }
  }
}