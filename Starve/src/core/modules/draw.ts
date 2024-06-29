import { get } from './memory';
import { globalObject } from '@/core/utils';

type RenderFunction = (context: CanvasRenderingContext2D, delta: number) => void;

let can: HTMLCanvasElement | undefined = undefined;
let ctx: CanvasRenderingContext2D | undefined = undefined;

export function initializeCanvas(): boolean {
  if (!can || typeof can === 'undefined')
    can = globalObject.document.getElementById('game_canvas')! as HTMLCanvasElement;

  ctx = can.getContext('2d')!;
  return !!can;
}

let last: number = 0;
let delta: number = 0;

const frames: number[] = [];
const drawFns: RenderFunction[] = [];

export function draw (timestamp: number = 0): void {
  const ready = get<boolean>('READY');
  if (!ready) return;

  globalObject.requestAnimationFrame(draw);

  const ms = timestamp - last;
  
  frames.push(ms);
  if (frames.length > 100) frames.shift();

  delta = ms / 1000;
  delta = delta > 1 ? 1 : delta;

  last = timestamp;
  
  for (const render of drawFns) render(ctx!, delta);
};

export function addToDraw (renderFunction: RenderFunction): void {
  if (!drawFns.includes(renderFunction)) drawFns.push(renderFunction);
};

export function removeFromDraw (renderFunction: RenderFunction): void {
  const index = drawFns.indexOf(renderFunction);
  if (index !== -1) drawFns.splice(index, 1);
};

export function getFramesPerSecond(): number {
  return globalObject.Math.round(1000 / (frames.reduce((a, b) => a + b, 0) / frames.length));
}