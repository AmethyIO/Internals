import { addToDraw, draw, get, initializeCanvas, processAutocraftSwitch, processAutofarmSwitch, set, TO_INITIALIZE_WITHOUT_ENABLING, TO_INITIALIZE_WITHOUT_ENABLING_L } from './core/modules';
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

function applyEnabledAutos() {
  for (let i = 0; i < TO_INITIALIZE_WITHOUT_ENABLING_L; i++) {
    const auto = TO_INITIALIZE_WITHOUT_ENABLING[i];

    if (typeof auto !== 'function')
      continue;

    auto();
  }
}

function processKeyboard(e: KeyboardEvent): void {
  if (VARS.USER[PROPS.CHAT][getObjectProperty(VARS.USER[PROPS.CHAT], 'USER_CHAT_OPEN', 1)!]) return;
  if (VARS.USER[PROPS.TERMINAL][getObjectProperty(VARS.USER[PROPS.CHAT], 'USER_TERMINAL_OPEN', 1)!]) return;

  if (e.code === settings.autofarm.keybind) {
    settings.autofarm.enabled = !settings.autofarm.enabled;
    
    if (settings.autofarm.enabled)
      processAutofarmSwitch();
  }

  if (e.code === settings.autocraft.keybind) {
    settings.autocraft.enabled = !settings.autocraft.enabled;

    if (settings.autocraft.enabled)
      processAutocraftSwitch();
  }

  if (e.code === 'KeyZ' || e.code === 'KeyX' || e.code === 'KeyN' || e.code === 'KeyV' || e.code === 'KeyB') {
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
      case 'KeyN': {
        settings.autofarm.xx = player[getObjectProperty(player, 'PLAYER_X', 4)!];
        break;
      }
      case 'KeyV': {
        settings.autofarm.yy = player[getObjectProperty(player, 'PLAYER_Y', 5)!];
        break;
      }
      case 'KeyB': {
        settings.autofarm.autowater = !settings.autofarm.autowater;
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
  applyEnabledAutos();

  globalObject.addEventListener('keydown', processKeyboard, false);

  // let c = 0;
  // for (const p in VARS.CLIENT) {
  //   c++;

  //   if (typeof VARS.CLIENT[p] === 'function') {
  //     console.log(`client.${p} - ${c}`);
  //   }
  // }

  // setInterval(() => {
  //   // console.log(OBJ_PROPS);
  //   console.log(VARS.USER[PROPS.UID]);    console.log(VARS.MOUSE[PROPS.POS]);
  // }, 1000);

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