import { addToDraw, draw, get, set } from './modules';
import { BASE_HOOKS } from "./constants";
import { globalObject, sleep } from './utils';
import { getHookedVars, hook } from "./core";
import { drawBase, updateHooks } from './drawers';

function readyCallback() {
  const vars = getHookedVars();
  const ready = get<boolean>('READY');
  const canvas = get<HTMLCanvasElement>('CANVAS');
  if (!canvas) 
    set<HTMLCanvasElement>(
      'CANVAS',
      globalObject.document.getElementById('game_canvas') as HTMLCanvasElement
    );

  if (!ready && (vars.USER !== undefined && vars.GAME !== undefined && vars.WORLD !== undefined && vars.CLIENT !== undefined)) {
    set<boolean>('READY', true);

    set<CanvasRenderingContext2D>(
      'CONTEXT',
      canvas?.getContext('2d')!
    );
  } else return;

  draw(0);
  addToDraw(drawBase);
  addToDraw(updateHooks);

  console.log('ready', vars);
}

async function waitUntilReady() {
  let ready = get<boolean>('READY');

  while (!ready) {
    ready = get<boolean>('READY');

    await sleep(50);
    readyCallback();
  }
}

async function bootstrap () {
  hook(BASE_HOOKS);

  await waitUntilReady();
}

bootstrap();