import { globalObject } from "@/core/utils";
import { getLocalAlive } from "@/core/hooks";
import { GLOBAL, settings } from "@/core/constants";
import { getObjectProperty, PROPS, VARS } from "@/core";

let initialized: boolean = false;

function initializeAutocraft(): void {
  if (initialized || !settings.autocraft.enabled) return;

  processAutocraft();
  globalObject.setInterval(processAutocraft, 50);

  initialized = true;
}

/**
 * Switch the autocraft process based on settings.
 */
export function processAutocraftSwitch(): void {
  if (settings.autocraft.enabled && !initialized)
    initializeAutocraft();
}

function processAutocraft(): void {
  if (!initialized || !getLocalAlive() || !settings.autocraft.enabled) return;

  const crafting = VARS.USER[PROPS.CRAFT][getObjectProperty(VARS.USER[PROPS.CRAFT], 'USER_CRAFTING', 4)!];
  if (crafting) return;

  if (GLOBAL.LAST_CRAFT !== undefined)
    VARS.CLIENT[PROPS.SELECT_CRAFT](GLOBAL.LAST_CRAFT);
}