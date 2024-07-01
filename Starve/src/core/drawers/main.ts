import { getFramesPerSecond } from '@/core/modules';
import { settings } from '../constants';
// import { globalObject } from '@/core/utils';

let frames: number = 0;

export function drawBase(context: CanvasRenderingContext2D): void {
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

export function drawDebugSettings(context: CanvasRenderingContext2D): void {
  let text_y = 0;
  let text_yy = 0;

  context.save();
  context.font = '16px Baloo Paaji';
  context.fillStyle = '#fff';
  context.lineWidth = 3;

  for (const [setting, obj] of Object.entries(settings)) {
    // if (obj.enabled) {
    context.strokeText(setting, 10, 80 + text_y + text_yy);
    context.fillText(setting, 10, 80 + text_y + text_yy);

    for (const [key, value] of Object.entries(obj)) {
      const t = `${key}: ${value}`;
      context.strokeText(t, 25, 100 + text_y + text_yy);
      context.fillText(t, 25, 100 + text_y + text_yy);

      text_yy += 20;
    }
    // }

    text_y += 20;
  }

  context.restore();
}