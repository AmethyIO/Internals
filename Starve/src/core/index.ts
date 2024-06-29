import { get } from '@/core/modules';
import { getObjectTypeName, globalObject, isArray } from '@/core/utils';
import type { Hook, StrAny } from '@/core/types';

export function hook(hooks: [string, Hook][]): boolean {
  if (!isArray(hooks))
    return false;
  
  let done: boolean = false;
  let hooked: number = 0;

  const length: number = hooks.length;

  for (let index: number = 0; index < length; index++) {
    const hook: [string, Hook] = hooks[index];

    if (hook && isArray(hook)) {
      const [ name, obj ] = hook;

      try {
        const ready = !!globalObject.Object.defineProperty(globalObject.Object.prototype, name, obj);
        ready && hooked++; 
      } catch (e: any) {
        throw `Hooking '${name}' failed: ${e.message}`;
      }
    }
  }

  if (hooked === length && !done) done = true;

  return done;
}

export const VARS: StrAny = {};
VARS.USER = undefined;
VARS.GAME = undefined;
VARS.WORLD = undefined;
VARS.MOUSE = undefined;
VARS.CLIENT = undefined;

export function setHookedVar(property: string, value: any): boolean {
  if (!(property in VARS))
    throw new globalObject.ReferenceError(`Cannot set var '${property}': var not found`);

  VARS[property] = value;
  return true;
}

export const PROPS: StrAny = {};

export function getVarProperty(hookedVar: string, defineAs: string, index: number = 1): string {
  const ready = get<boolean>('READY') ?? false;
  if (!ready) throw new globalObject.ReferenceError('Game is not ready yet');

  if (typeof VARS[hookedVar] === 'undefined' || !(hookedVar in VARS))
    throw new globalObject.ReferenceError(`Cannot get var '${hookedVar}': ${!(hookedVar in VARS) ? 'var not found' : 'var not defined yet'}`);

  if (!(defineAs in PROPS))
    PROPS[defineAs] = undefined;
  
  if (typeof PROPS[defineAs] === 'undefined') {
    let prop: string = '';
    let counter: number = 0;

    for (const property in VARS[hookedVar]) {
      counter++;

      if (counter === index) {
        PROPS[defineAs] = property;
        prop = property;
        break;
      }
    }

    return prop;
  }

  return PROPS[defineAs];
}

export const OBJ_PROPS: StrAny = {};

export function getObjectProperty(obj: any, defineAs: string, index: number = 1): string | undefined {
  const ready = get<boolean>('READY');
  if (!ready) throw new globalObject.ReferenceError('Game is not ready yet');

  const objName: string = getObjectTypeName(obj);
  if (!(objName in OBJ_PROPS))
    OBJ_PROPS[objName] = {};

  const o = OBJ_PROPS[objName];

  if (!(defineAs in o)) {
    let counter: number = 0;
    let property: string | undefined = undefined;
  
    for (const prop in obj) {
      counter++;
      if (counter === index) {
        o[defineAs] = prop;
        property = prop;
        break;
      }
    }

    return property;
  }

  return o[defineAs];
}