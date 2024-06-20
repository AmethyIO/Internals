import { DEV } from "@/constants";
import { get } from "@/modules";
import { globalObject, isArray } from "@/utils";

import type { Hook, ObjAny, StrAny } from "@/interfaces";

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

// export const OBJECTS_PROPS: StrAny = {};
// export function getObjectProperty(object: any, defineAs: string, index: number = 1): string {
//   const ready = get<boolean>('READY');
//   if (!ready) throw new globalObject.ReferenceError('Game is not ready yet');
//   let prop: string | undefined = undefined;
//   let counter: number = 0;
//   for (const property in object) {
//     counter++;
//     if (counter === index) {
//       prop = property;
//       break;
//     }
//   }
//   if (typeof prop === 'string') {
//     if (!(object in OBJECTS_PROPS))
//       OBJECTS_PROPS[object] = {}
//     const obj = OBJECTS_PROPS[object];
//     if (!(defineAs in obj) || obj[defineAs] !== prop)
//       obj[defineAs] = prop;
//   }
// }

const OBJ_PROPS: StrAny = {};

export function getObjectProperty(obj: any, defineAs: string, index: number = 1): string | undefined {
  const ready = get<boolean>('READY');
  if (!ready) throw new globalObject.ReferenceError('Game is not ready yet');

  const objName: string = obj.constructor ? obj.constructor.name : obj;
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

export const getCameraPosition = (): number[] => {
  let camx = 0;
  let camy = 0;
  const ready = get<boolean>('READY');

  if (!VARS.USER[PROPS.ALIVE] || !ready)
    return [camx, camy];

  for (const prop1 in VARS.USER) {
    for (const prop2 in VARS.USER[prop1]) {
      switch (prop2) {
        case "x":
          camx = VARS.USER[prop1][prop2];
          break;
        case "y":
          camy = VARS.USER[prop1][prop2];
          break;
      }
    }
  }

  return [camx, camy];
};