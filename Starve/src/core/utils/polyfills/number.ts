import { globalObject } from "../global";

export function getReadableTime(seconds: number) {
  if (seconds < 1)
    return `${(seconds * 60).toFixed(0)}s`;
  
  return `${seconds.toFixed(2)}m`;
}

export function getRandomInt(min: number, max: number) {
  min = globalObject.Math.ceil(min);
  max = globalObject.Math.floor(max);

  return ~~(globalObject.Math.random() * (max - min + 1)) + min;
}