import { globalObject } from "../global";

export function getReadableTime(seconds: number) {
  if (seconds < 0) return "0.00s";

  const minutes = ~~(seconds / 60);
  const remainingSeconds = ~~(seconds % 60);
  
  const paddedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${minutes}.${paddedSeconds}${seconds > 60 ? 'm' : 's'}`;
}

export function getRandomInt(min: number, max: number) {
  min = globalObject.Math.ceil(min);
  max = globalObject.Math.floor(max);

  return ~~(globalObject.Math.random() * (max - min + 1)) + min;
}