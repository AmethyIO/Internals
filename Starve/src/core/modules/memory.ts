import { globalObject } from '@/core/utils';
import type { Memory } from '@/core/types';

// Initialize a Map to store key-value pairs in memory.
const memory: Map<string, any> = new globalObject.Map();

/**
 * Get a value from memory.
 *
 * @param key - The key of the value to retrieve.
 * @returns The value associated with the key, or undefined if the key is not found.
 */
export const get: Memory['get'] = <T>(key: string): T | undefined => memory.get(key) ?? undefined;

/**
 * Set a value in memory.
 *
 * @param key - The key to associate with the value.
 * @param value - The value to store in memory.
 */
export const set: Memory['set'] = <T>(key: string, value: T) => memory.set(key, value);

/**
 * Remove a value from memory.
 *
 * @param key - The key of the value to remove.
 */
export const remove: Memory['remove'] = (key: string) => memory.delete(key);
