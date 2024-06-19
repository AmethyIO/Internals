import { hook } from "@/core";
import { BASE_HOOKS } from "@/constants";

export const updateHooks = (): void => {
  hook(BASE_HOOKS);
};