import { get } from '@/core/modules';
import { getObjectTypeName, globalObject, isArray } from '@/core/utils';
import type { Hook, StrAny } from '@/core/types';

/**
 * Hook into global object properties.
 *
 * @param hooks - An array of tuples, each containing a string and a Hook function.
 * @returns True if all hooks are successfully applied, otherwise false.
 */
export function hook(hooks: [string, any, Hook][]): void {
  // Check if the hooks parameter is an array.
  if (!isArray(hooks)) return;

  const length: number = hooks.length;

  // Iterate through each hook and apply it to the global object.
  for (let index: number = 0; index < length; index++) {
    const hook: [string, any, Hook] = hooks[index];

    if (hook && isArray(hook)) {
      const [name, prototype, obj] = hook;

      try {
        // Define a property on the global object.
        globalObject.Object.defineProperty(prototype, name, obj);
      } catch (e: any) {
        // Throw an error if hooking fails.
        throw `Hooking '${name}' failed: ${e.message}`;
      }
    }
  }
}

// Initialize a global variable storage object.
export const VARS: StrAny = {};
VARS.USER = undefined;
VARS.GAME = undefined;
VARS.WORLD = undefined;
VARS.MOUSE = undefined;
VARS.CLIENT = undefined;

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

// A map to store the relationship between original functions and their proxies
const hookedFunctions = new globalObject.Map<Function, Function>();

/**
 * Hooks a given function by replacing it with a proxy that calls the hook function first.
 * @param originalFunction - The function to be hooked.
 * @param hookFunction - The hook function to be called before the original function.
 * @returns True if the function was successfully hooked, false if it was already hooked.
 * @throws Will throw an error if the function pointer or hook function is invalid.
 */
export function hookFunction(originalFunction: Function, hookFunction: Function): boolean {
  if (!originalFunction || !hookFunction)
    throw new globalObject.ReferenceError('Invalid function pointer or hook function');

  if (hookedFunctions.has(originalFunction))
    return false; // Function is already hooked

  const proxy = new globalObject.Proxy(originalFunction, {
    'apply': (target, thisArg, argumentsList) => {
      return hookFunction.apply(thisArg, [target.bind(thisArg), ...argumentsList]);
    }
  });

  hookedFunctions.set(originalFunction, proxy);
  return true;
}

/**
 * Unhooks a previously hooked function, restoring it to its original state.
 * @param originalFunction - The function to be unhooked.
 * @returns True if the function was successfully unhooked, false if it was not hooked.
 * @throws Will throw an error if the function pointer is invalid.
 */
export function unhookFunction(originalFunction: Function): boolean {
  if (!originalFunction)
    throw new globalObject.ReferenceError('Invalid function pointer');

  if (!hookedFunctions.has(originalFunction))
    return false; // Function is not hooked

  hookedFunctions.delete(originalFunction);
  return true;
}

/**
 * Retrieves the currently hooked version of a function if it exists, or the original function if it doesn't.
 * @param originalFunction - The function to be retrieved.
 * @returns The hooked version of the function if it exists, otherwise the original function.
 */
export function getHookedFunction(originalFunction: Function): Function {
  return hookedFunctions.get(originalFunction) || originalFunction;
}