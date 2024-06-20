import { globalObject } from '@/utils';
import { get } from './memory.module';

type RenderFunction = (context: CanvasRenderingContext2D, delta: number) => void;

let last: number = 0;
let delta: number = 0;

const frames: number[] = [];
const drawFns: RenderFunction[] = [];

export const draw = (timestamp: number = 0): void => {
  const ready = get<boolean>('READY');
  if (!ready) return;

  globalObject.requestAnimationFrame(draw);

  const ms = timestamp - last;
  
  frames.push(ms);
  if (frames.length > 100) frames.shift();

  delta = (timestamp - last) / 1000;
  delta = delta > 1 ? 1 : delta;
  last = timestamp;
  
  const context = get<CanvasRenderingContext2D>('CONTEXT');
  for (const render of drawFns) render(context!, delta);
};

export const addToDraw = (renderFunction: RenderFunction): void => {
  if (!drawFns.includes(renderFunction)) drawFns.push(renderFunction);
};

export const removeFromDraw = (renderFunction: RenderFunction): void => {
  const index = drawFns.indexOf(renderFunction);
  if (index !== -1) drawFns.splice(index, 1);
};

export const getFPS = (): number => globalObject.Math.round(1000 / (frames.reduce((a, b) => a + b, 0) / frames.length));