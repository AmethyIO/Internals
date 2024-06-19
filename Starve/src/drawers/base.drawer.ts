import { getFPS } from "@/modules";
import { globalObject } from "@/utils";

let logoImg: typeof Image | HTMLImageElement | undefined = undefined;

export const drawLogo = (context: CanvasRenderingContext2D) => {
  if (!logoImg) {
    logoImg = new globalObject.Image();
    logoImg.src = '';
  }
};

export const drawBase = (context: CanvasRenderingContext2D, delta: number): void => {
  // console.log(delta);

  context.save();

  // Draw FPS
  const fps: number = getFPS();
  const fpsT: string = `FPS: ${fps}`;

  context.font = "16px Baloo Paaji";
  context.fillStyle = "#fff";
  context.lineWidth = 4;
  context.strokeText(fpsT, 10, 50);
  context.fillText(fpsT, 10, 50);

  context.restore();
};