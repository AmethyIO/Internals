import { addToDraw, draw, get, initializeCanvas, set } from './core/modules';
import { BASE_HOOKS, hookAllProperties } from './core/constants';
import { sleep } from './core/utils';
import { VARS, PROPS, hook } from './core';
import { DRAWERS } from './core/drawers';

function applyDraws() {
  const len = DRAWERS.length;
  for (let i = 0; i < len; i++) {
    const draw = DRAWERS[i];
    
    if (typeof draw !== 'function')
      continue;

    addToDraw(draw);
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

  // setInterval(() => {
  //   console.log(OBJ_PROPS);
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