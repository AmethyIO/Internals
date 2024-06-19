import { globalObject } from "@/utils";
import type { Memory } from "@/interfaces";

const memory: Map<string, any> = new globalObject.Map();

export const get: Memory['get'] = <T>(key: string): T | undefined => memory.get(key) ?? undefined;

export const set: Memory['set'] = <T>(key: string, value: T): void => {
  memory.set(key, value);
};

export const remove: Memory['remove'] = (key: string): void => {
  memory.delete(key);
};