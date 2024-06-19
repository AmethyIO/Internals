import { DEV } from "@/constants";
import { get } from "@/modules";
import { globalObject, isArray } from "@/utils";

import type { Hook, StrAny } from "@/interfaces";

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

  if (DEV && done) globalObject.console.log(`Successfully hooked ${length} properties`);

  return done;
}

const VARS: StrAny = {};
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

export function getHookedVars(): StrAny {
  return VARS;
}

const PROPS: StrAny = {};

export function getProps(): StrAny {
  return PROPS;
}

export function getVarProperty(hookedVar: string, defineAs: string, index: number = 1): string {
  const ready = get<boolean>('READY') ?? false;
  if (!ready) throw new globalObject.ReferenceError('Game is not ready yet');

  if (typeof VARS[hookedVar] === 'undefined' || !(hookedVar in VARS))
    throw new globalObject.ReferenceError(`Cannot get var '${hookedVar}': ${!(hookedVar in VARS) ? 'var not found' : 'var not defined yet'}`);

  let prop: string = '';
  let counter: number = 0;

  for (const property in VARS[hookedVar]) {
    counter++;

    if (counter === index) {
      if ((typeof defineAs === 'string' && !(defineAs in PROPS)) || PROPS[defineAs] !== property)
        PROPS[defineAs] = property;

      prop = property;
      break;
    }
  }

  return prop;
}

export function getObjectProperty(obj: Object, index: number = 1): string | undefined {
  const ready = get<boolean>('READY') ?? false;
  if (!ready) throw new globalObject.ReferenceError('Game is not ready yet');

  let counter: number = 0;
  let property: string | undefined = undefined;

  for (const prop in obj) {
    counter++;

    if (counter === index) {
      property = prop;
      break;
    }
  }

  return property;
}