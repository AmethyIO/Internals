import { addToDraw, draw, get, initializeCanvas, processAutofarmSwitch, set } from './core/modules';
import { BASE_HOOKS, hookAllProperties, settings } from './core/constants';
import { globalObject, sleep } from './core/utils';
import { VARS, PROPS, hook, getObjectProperty } from './core';
import { DRAWERS } from './core/drawers';
import { getLocalPlayer } from './core/hooks';

function applyDraws() {
  const len = DRAWERS.length;
  for (let i = 0; i < len; i++) {
    const draw = DRAWERS[i];

    if (typeof draw !== 'function')
      continue;

    addToDraw(draw);
  }
}

function processKeyboard(e: KeyboardEvent): void {
  if (e.code === settings.autofarm.keybind) {
    settings.autofarm.enabled = !settings.autofarm.enabled;
    processAutofarmSwitch();
  }

  if (e.code === 'KeyZ' || e.code === 'KeyX' || e.code === 'KeyC' || e.code === 'KeyV') {
    const player = getLocalPlayer();
    if (!player) return;

    switch (e.code) {
      case 'KeyZ': {
        settings.autofarm.x = player[getObjectProperty(player, 'PLAYER_X', 4)!];
        break;
      }
      case 'KeyX': {
        settings.autofarm.y = player[getObjectProperty(player, 'PLAYER_Y', 5)!];
        break;
      }
      case 'KeyC': {
        settings.autofarm.xx = player[getObjectProperty(player, 'PLAYER_X', 4)!];
        break;
      }
      case 'KeyV': {
        settings.autofarm.yy = player[getObjectProperty(player, 'PLAYER_Y', 5)!];
        break;
      }
    }
  }
}

function readyCallback() {
  const ready = get<boolean>('READY');

  if (!ready && (VARS.USER !== undefined && VARS.GAME !== undefined && VARS.WORLD !== undefined && VARS.CLIENT !== undefined)) {
    set<boolean>('READY', true);
  } else return;

  initializeCanvas();
  draw(0);
  applyDraws();
  hookAllProperties();


  globalObject.addEventListener('keydown', processKeyboard, false);

  setInterval(() => {
    // console.log(OBJ_PROPS);
    console.log(VARS.USER[PROPS.UID]);
  }, 1000);

  console.log('ready', VARS, PROPS);
}

async function waitUntilReady() {
  let ready = get<boolean>('READY');

  while (!ready) {
    ready = get<boolean>('READY');

    await sleep(50);
    readyCallback();
  }
}

async function bootstrap() {
  // if (process.env.NODE_ENV === 'production')

  if (/*!devtools.isOpen*/ true) {
    hook(BASE_HOOKS);
    await waitUntilReady();
  }
}

bootstrap();