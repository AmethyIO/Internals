import { getLocalPlayer } from "@/core/hooks";
import { getObjectProperty, hookFunction, PROPS, VARS } from "@/core";
import { settings, GLOBAL, INVENTORY_ID } from "@/core/constants";
import { globalObject } from "@/core/utils";

let localPlayer: any | undefined = undefined;

/**
 * Select the book item in the player's inventory.
 */
function selectBook(): void {
  localPlayer = getLocalPlayer();
  if (!localPlayer) return;

  const n = getObjectProperty(VARS.USER[PROPS.INVENTORY], 'INVENTORY_N', 4)!;
  const right = localPlayer[getObjectProperty(localPlayer, 'UNIT_RIGHT', 61)!];

  if (VARS.USER[PROPS.INVENTORY][n][INVENTORY_ID.BOOK] && right !== INVENTORY_ID.BOOK)
    VARS.CLIENT[PROPS.SELECT_INV](INVENTORY_ID.BOOK);
}

export function initializeAutobook(): void {
  VARS.CLIENT[PROPS.SELECT_CRAFT] = function (id: number) {
    if (GLOBAL.LAST_CRAFT === undefined || GLOBAL.LAST_CRAFT !== id)
      GLOBAL.LAST_CRAFT = id;

    if (settings.autobook.enabled)
      selectBook();
    
    VARS.CLIENT[PROPS.SOCKET]['send'](globalObject.JSON.stringify([26, id]));
  }
}