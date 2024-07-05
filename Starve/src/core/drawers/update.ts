import { hook, PROPS, VARS } from '@/core';
import { BASE_HOOKS, GLOBAL } from '@/core/constants';

export function updateHooks(): void {
  hook(BASE_HOOKS);
}