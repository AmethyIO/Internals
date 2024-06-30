import type guify from 'guify';
import { PROPS, VARS } from '..';
import { globalObject } from '../utils';

let gui: typeof guify | undefined = undefined;

export const settings = {
  autofarm: {
    e: false,
    k: 'KeyU',
    a: null,
    w: false,
    x: null,
    xx: null,
    y: null,
    yy: null,
    sy: null,
    sx: null
  }
};

export function createGuify() {
  if (gui)
    return;

  gui = new (globalObject as any).guify();

  gui.Register({
    ['type']: 'folder',
    ['label']: 'Settings',
    ['open']: false,
  });

  gui.Register([{
    type: 'checkbox',
    label: 'Start',
    object: settings.autofarm,
    property: 'e',
    onChange: (data: any) => {
      console.log('start change', data);
    }
  }, {
    type: 'checkbox',
    label: 'Autowater',
    object: settings.autofarm,
    property: 'w',
    onChange: (data: any) => {
      console.log('start change', data);
    }
  }, {
    type: 'button',
    label: 'Top farm',
    action: (data: any) => {
      if (!VARS.USER[PROPS.ALIVE] || !VARS.CLIENT[PROPS.SOCKET]) return;

      const player = VARS.WORLD[PROPS.FAST_UNITS][VARS.USER[PROPS.ID] * 1000];
      if (player) {
        settings.autofarm.x = player['x'];
        settings.autofarm.y = player['y'];
      }
    }
  }, {
    type: 'button',
    label: 'Bottom farm',
    action: (data: any) => {
      if (!VARS.USER[PROPS.ALIVE] || !VARS.CLIENT[PROPS.SOCKET]) return;

      const player = VARS.WORLD[PROPS.FAST_UNITS][VARS.USER[PROPS.ID] * 1000];
      if (player) {
        settings.autofarm.xx = player['x'];
        settings.autofarm.yy = player['y'];
      }
    }
  }, {
    type: 'display',
    label: 'X',
    object: settings.autofarm,
    property: 'x'
  }, {
    type: 'display',
    label: 'Y',
    object: settings.autofarm,
    property: 'y'
  }, {
    type: 'display',
    label: 'X1',
    object: settings.autofarm,
    property: 'xx'
  }, {
    type: 'display',
    label: 'Y1',
    object: settings.autofarm,
    property: 'yy'
  }], {
    folder: 'Settings'
  });
}