import { hook } from '@/core';
import { BASE_HOOKS } from '@/core/constants';

export function updateHooks (): void {
  hook(BASE_HOOKS);
}