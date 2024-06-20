import { hook, PROPS, VARS } from "@/core";
import { BASE_HOOKS } from "@/constants";
import { get } from "@/modules";

export const updateHooks = (): void => {
  hook(BASE_HOOKS);
};