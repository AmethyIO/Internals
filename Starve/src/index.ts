import { addToDraw, draw, get, set } from './modules';
import { BASE_HOOKS, PROP_HOOKS } from "./constants";
import { globalObject, isArray, sleep } from './utils';
import { VARS, PROPS, getVarProperty, hook } from "./core";
import { drawBase, updateHooks } from './drawers';
import { drawInfos } from './drawers/info.drawer';

function hookAllProperties() {
  const length = PROP_HOOKS.length;

  for (let index: number = 0; index < length; index++) {
    const hookProp = PROP_HOOKS[index];

    if (hookProp && isArray(hookProp)) {
      const [ variable, property, address ] = hookProp;

      const hooked = getVarProperty(
        variable as string,
        property as string,
        address as number
      );

      if (!!hooked) console.log(`found ${variable}.${property} in address ${address} (${hooked})`);
    }
  }
}

function readyCallback() {
  const ready = get<boolean>('READY');
  const canvas = get<HTMLCanvasElement>('CANVAS');
  if (!canvas) 
    set<HTMLCanvasElement>(
      'CANVAS',
      globalObject.document.getElementById('game_canvas') as HTMLCanvasElement
    );

  if (!ready && (VARS.USER !== undefined && VARS.GAME !== undefined && VARS.WORLD !== undefined && VARS.CLIENT !== undefined)) {
    set<boolean>('READY', true);

    set<CanvasRenderingContext2D>(
      'CONTEXT',
      canvas?.getContext('2d')!
    );
  } else return;

  draw(0);

  addToDraw(drawBase);
  addToDraw(drawInfos);
  addToDraw(updateHooks);

  hookAllProperties();

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

async function bootstrap () {
  hook(BASE_HOOKS);

  await waitUntilReady();
}

bootstrap();