const getGlobalObject = (context: Window | any) => context && context.Math === context.Math && context;

export const globalObject: typeof window =
  getGlobalObject(typeof self === 'object' && self) ||
  getGlobalObject(typeof window === 'object' && window) ||
  getGlobalObject(typeof globalThis === 'object' && globalThis) ||
  window as typeof window;