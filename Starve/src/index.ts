import { addToDraw, draw, get, initializeCanvas, initializeVoiceModule, processAutocraftSwitch, processAutofarmSwitch, set, TO_INITIALIZE_WITHOUT_ENABLING, TO_INITIALIZE_WITHOUT_ENABLING_L } from './core/modules';
import { BASE_HOOKS, hookAllProperties, settings } from './core/constants';
import { globalObject, sleep } from './core/utils';
import { VARS, PROPS, hook, getObjectProperty } from './core';
import { DRAWERS } from './core/drawers';
import { getLocalAlive, getLocalPlayer } from './core/hooks';
import { initializeSocket } from './amethyst';
import { dependencies, injectDependencies } from './amethyst/dependencies';

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

function removeAds() {
  // Remove ads elements
  const trevda = globalObject.document.getElementById('trevda');
  const preroll = globalObject.document.getElementById('preroll');
  [trevda, preroll].forEach(e => e?.remove());

  // Hide recaptcha
  const style = globalObject.document.createElement('style');
  style.innerHTML = '.grecaptcha-badge{visibility:hidden}';

  globalObject.document.head.appendChild(style);
}

function processKeyboard(e: KeyboardEvent): void {
  if (!getLocalAlive()) return;
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
        settings.autofarm.x = player[getObjectProperty(player, 'UNIT_X', 4)!];
        break;
      }
      case 'KeyX': {
        settings.autofarm.y = player[getObjectProperty(player, 'UNIT_Y', 5)!];
        break;
      }
      case 'KeyN': {
        settings.autofarm.xx = player[getObjectProperty(player, 'UNIT_X', 4)!];
        break;
      }
      case 'KeyV': {
        settings.autofarm.yy = player[getObjectProperty(player, 'UNIT_Y', 5)!];
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

  removeAds();
  initializeCanvas();
  draw(0);

  applyDraws();
  hookAllProperties();
  applyEnabledAutos();

  // initializeVoiceModule();

  globalObject.addEventListener('keydown', processKeyboard, false);

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
  injectDependencies(dependencies);
  initializeSocket();

  if (/*!devtools.isOpen*/ true) {
    hook(BASE_HOOKS);
    await waitUntilReady();
  }
}

bootstrap();