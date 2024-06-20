const getGlobalObject = (context: Window | any) => context && context.Math === context.Math && context;

export const globalObject: typeof window =
  getGlobalObject(typeof self === 'object' && self) ||
  getGlobalObject(typeof window === 'object' && window) ||
  getGlobalObject(typeof globalThis === 'object' && globalThis) ||
  window as typeof window;

export const isArray = (array: Array<any>): boolean => !!globalObject.Array.isArray(array);

export function getObjectTypeName(obj: any): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  
  if (typeof obj === 'object' && obj.constructor) {
    return obj.constructor.name;
  } else if (typeof obj === 'function') {
    return obj.name;
  } else if (typeof obj === 'object') {
    return 'Object';
  }

  return typeof obj;
}