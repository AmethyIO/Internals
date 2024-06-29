// TODO: find way to hook it normal than atm

import { PROPS, VARS } from '@/core';
import { globalObject } from '../utils';

let camx = -1;
let camy = -1;

export function getCameraPosition(): number[] {
  return [camx, camy];
}

export function updateCameraPosition(): void {
  if (!VARS.USER[PROPS.ALIVE] || (VARS.CLIENT[PROPS.SOCKET] && VARS.CLIENT[PROPS.SOCKET]['readyState'] !== globalObject.WebSocket.OPEN)) {
    if (camx !== 0 || camy !== 0)
      camx = camy = 0;

    return;
  }

  for (const prop1 in VARS.USER) {
    for (const prop2 in VARS.USER[prop1]) {
      switch (prop2) {
        case 'x':
          camx = VARS.USER[prop1][prop2];
          break;
        case 'y':
          camy = VARS.USER[prop1][prop2];
          break;
      }
    }
  }
}