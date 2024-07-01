import { get } from './memory';
import { globalObject } from '../utils';
import type { RenderFunction } from '../types';

let can: HTMLCanvasElement | undefined = undefined;
let ctx: CanvasRenderingContext2D | undefined = undefined;

/**
 * Initialize the canvas element and its 2D rendering context.
 *
 * @returns True if the canvas is successfully initialized, otherwise false.
 */
export function initializeCanvas(): boolean {
  // Retrieve the canvas element by its ID if it's not already defined.
  if (!can || typeof can === 'undefined') {
    can = globalObject.document.getElementById('game_canvas')! as HTMLCanvasElement;
  }

  // Get the 2D rendering context from the canvas.
  ctx = can.getContext('2d')!;
  return !!can;
}

let last: number = 0;  // Timestamp of the last frame.
let delta: number = 0;  // Time difference between the current and last frame.

const frames: number[] = [];  // Array to store frame durations.
const drawFns: RenderFunction[] = [];  // Array to store render functions.

/**
 * Main draw function that handles rendering and frame timing.
 *
 * @param timestamp - The current timestamp, automatically provided by requestAnimationFrame.
 */
export function draw (timestamp: number = 0): void {
  // Check if the game is ready to be drawn.
  const ready = get<boolean>('READY');
  if (!ready) return;

  // Request the next animation frame.
  globalObject.requestAnimationFrame(draw);

  // Calculate the time difference between the current and last frame.
  const ms = timestamp - last;
  
  // Store the frame duration.
  frames.push(ms);
  if (frames.length > 100) frames.shift();  // Keep only the last 100 frames.

  // Calculate the delta time in seconds, capped at 1 second.
  delta = ms / 1000;
  delta = delta > 1 ? 1 : delta;

  // Update the timestamp of the last frame.
  last = timestamp;
  
  // Call each render function with the rendering context and delta time.
  for (const render of drawFns) render(ctx!, delta);
}

/**
 * Add a render function to the list of functions to be called each frame.
 *
 * @param renderFunction - The render function to add.
 */
export function addToDraw (renderFunction: RenderFunction): void {
  if (!drawFns.includes(renderFunction)) drawFns.push(renderFunction);
}

/**
 * Remove a render function from the list of functions to be called each frame.
 *
 * @param renderFunction - The render function to remove.
 */
export function removeFromDraw (renderFunction: RenderFunction): void {
  const index = drawFns.indexOf(renderFunction);
  if (index !== -1) drawFns.splice(index, 1);
}

/**
 * Get the average frames per second (FPS) over the last 100 frames.
 *
 * @returns The average FPS.
 */
export function getFramesPerSecond(): number {
  return globalObject.Math.round(1000 / (frames.reduce((a, b) => a + b, 0) / frames.length));
}
