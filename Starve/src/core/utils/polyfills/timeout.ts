import { globalObject } from '../global';

export function sleep (ms: number): Promise<any> {
  return new globalObject.Promise(resolve => globalObject.setTimeout(resolve, ms));
}