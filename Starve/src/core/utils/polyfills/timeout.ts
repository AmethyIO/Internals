import type { Func } from '@/core/types';
import { globalObject } from '../global';

export function sleep (ms: number): Promise<any> {
  return new globalObject.Promise(resolve => globalObject.setTimeout(resolve, ms));
}

export function throttle (func: Func, limit: number): Func {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function(this: any, ...args: any[]) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = globalObject.Date.now();
    } else {
      globalObject.clearTimeout(lastFunc);

      // @ts-ignore
      lastFunc = globalObject.setTimeout(() => {
        if ((globalObject.Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = globalObject.Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}