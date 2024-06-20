import { globalObject } from "@/utils";
import { setHookedVar } from "@/core";
import type { Hook } from "@/interfaces";

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
  ['connect', { // NetworkClient hook
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
  ['USER',    'ALIVE',         11],
  ['USER',    'CAMERA',        28],
  ['USER',    'INVENTORY',     35],

  // World hooks
  ['WORLD',   'MODE',           1],
  ['WORLD',   'UNITS',          6],
  ['WORLD',   'PLAYERS',        5],
  ['WORLD',   'MAX_UNITS',      2],
  ['WORLD',   'FAST_UNITS',     7],

  // NetworkClient hooks
  ['CLIENT',  'SOCKET',         1],
];