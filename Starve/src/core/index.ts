import { get } from '@/core/modules';
import { getObjectTypeName, globalObject, isArray } from '@/core/utils';
import type { Hook, StrAny } from '@/core/types';

/**
 * Hook into global object properties.
 *
 * @param hooks - An array of tuples, each containing a string and a Hook function.
 * @returns True if all hooks are successfully applied, otherwise false.
 */
export function hook(hooks: [string, Hook][]): boolean {
  // Check if the hooks parameter is an array.
  if (!isArray(hooks)) return false;
  
  let done: boolean = false;
  let hooked: number = 0;
  const length: number = hooks.length;

  // Iterate through each hook and apply it to the global object.
  for (let index: number = 0; index < length; index++) {
    const hook: [string, Hook] = hooks[index];

    if (hook && isArray(hook)) {
      const [ name, obj ] = hook;

      try {
        // Define a property on the global object.
        const ready = !!globalObject.Object.defineProperty(globalObject.Object.prototype, name, obj);
        ready && hooked++; 
      } catch (e: any) {
        // Throw an error if hooking fails.
        throw `Hooking '${name}' failed: ${e.message}`;
      }
    }
  }

  // If all hooks are successfully applied, mark as done.
  if (hooked === length && !done) done = true;

  return done;
}

// Initialize a global variable storage object.
export const VARS: StrAny = {};
VARS.USER = undefined;
VARS.GAME = undefined;
VARS.WORLD = undefined;
VARS.MOUSE = undefined;
VARS.CLIENT = undefined;
VARS.KEYBOARD = undefined;

/**
 * Set a variable in the VARS object.
 *
 * @param property - The property name to set.
 * @param value - The value to set for the property.
 * @returns True if the variable is successfully set, otherwise throws an error.
 */
export function setHookedVar(property: string, value: any): boolean {
  if (!(property in VARS)) 
    throw new globalObject.ReferenceError(`Cannot set var '${property}': var not found`);

  VARS[property] = value;
  return true;
}

// Initialize a properties storage object.
export const PROPS: StrAny = {};

/**
 * Get a property name of a hooked variable.
 *
 * @param hookedVar - The name of the hooked variable.
 * @param defineAs - The alias to define the property as.
 * @param index - The index of the property to retrieve (default is 1).
 * @returns The property name as a string.
 */
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

    // Iterate through the properties of the hooked variable to find the specified index.
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

// Initialize an object properties storage object.
export const OBJ_PROPS: StrAny = {};

/**
 * Get a property name of an object.
 *
 * @param obj - The object to retrieve the property from.
 * @param defineAs - The alias to define the property as.
 * @param index - The index of the property to retrieve (default is 1).
 * @returns The property name as a string or undefined.
 */
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
  
    // Iterate through the properties of the object to find the specified index.
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
