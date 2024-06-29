import { getFramesPerSecond } from '@/core/modules';
// import { globalObject } from '@/core/utils';

let frames: number = 0;

export function drawBase (context: CanvasRenderingContext2D): void {
  const current = getFramesPerSecond();
  if (frames !== current) frames = current;

  context.save();

  context.font = '16px Baloo Paaji';
  context.fillStyle = '#fff';
  context.lineWidth = 4;

  // Draw FPS
  const t: string = `FPS: ${frames}`;
  
  context.strokeText(t, 10, 50);
  context.fillText(t, 10, 50);

  context.restore();
};