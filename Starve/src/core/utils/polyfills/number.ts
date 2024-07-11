import { getDelta } from "@/core/modules";
import { globalObject } from "../global";

export function getReadableTime(seconds: number): string {
  if (seconds < 1) {
    return `${(seconds * 60).toFixed(0)}s`;
  }

  return `${seconds.toFixed(2)}m`;
}

export function getRandomInt(min: number, max: number) {
  min = globalObject.Math.ceil(min);
  max = globalObject.Math.floor(max);

  return ~~(globalObject.Math.random() * (max - min + 1)) + min;
}

export function smoothTween(startValue: number, endValue: number, delta: number, callback: (tweenedNumber: number) => void): void {
  let startTime: number | undefined;

  function update(currentTime: number) {
    if (startTime === undefined) startTime = currentTime;
    const elapsedTime = currentTime - startTime;

    if (elapsedTime >= delta) {
      callback(endValue);
    } else {
      const progress = elapsedTime / delta;
      const easedValue = startValue + (endValue - startValue) * progress;
      callback(easedValue);
      globalObject.requestAnimationFrame(update);
    }
  }

  globalObject.requestAnimationFrame(update);
};

export const infinityClamp = (num: number, min: number) => globalObject.Number.isFinite(num) ? num : min;