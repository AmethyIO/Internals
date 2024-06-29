import { globalObject } from "../global";

export function isArray (array: Array<any>): boolean {
  return globalObject.Array.isArray(array);
}