import { getObjectProperty, PROPS, VARS } from "@/core";
import { INVENTORY_ID, settings } from "@/core/constants";
import { getLocalAlive, getLocalPlayer } from "@/core/hooks";
import { globalObject, sleep } from "@/core/utils";

let initialized: boolean = false;

const EATABLE = [
  [INVENTORY_ID.PLANT, 0.10],
  [INVENTORY_ID.GARLIC, 0.14],
  [INVENTORY_ID.CRAB_STICK, 0.2],
  [INVENTORY_ID.PUMPKIN, 0.3],
  [INVENTORY_ID.TOMATO, 0.16],
  [INVENTORY_ID.CARROT, 0.2],
  [INVENTORY_ID.WATERMELON, 0.15],
  [INVENTORY_ID.BREAD, 0.15],
  [INVENTORY_ID.COOKED_MEAT, 0.35],
  [INVENTORY_ID.FOODFISH_COOKED, 0.35],
  [INVENTORY_ID.COOKIE, 0.5],
  [INVENTORY_ID.SANDWICH, 1],
  [INVENTORY_ID.CRAB_LOOT, 0.1],
  [INVENTORY_ID.CAKE, 1]
];
const EATABLE_LEN = EATABLE.length;

export function initializeAutofood(): void {
  if (initialized || !settings.autofood.enabled) return;

  processAutofood();
  globalObject.setInterval(processAutofood, 4000);

  initialized = true;
}

async function processAutofood(): Promise<void> {
  if (!initialized || !getLocalAlive() || !settings.autofood.enabled) return;

  const player = getLocalPlayer();
  if (!player) return;

  const n = getObjectProperty(VARS.USER[PROPS.INVENTORY], 'INVENTORY_N', 4)!;

  let hunger: number = VARS.USER[PROPS.GAUGES][getObjectProperty(VARS.USER[PROPS.GAUGES], 'USER_GAUGES_H', 3)!];
  if (hunger < 0.38) {
    for (let index: number = 0; index < EATABLE_LEN; index++) {
      const FOOD = EATABLE[index];
      const [FOOD_ID, FOOD_REDUCE_HUNGER] = FOOD;

      while (VARS.USER[PROPS.INVENTORY][n][FOOD_ID] && hunger < 1) {
        await sleep(500);

        VARS.CLIENT[PROPS.SELECT_INV](FOOD_ID);
        console.log('ate', FOOD_ID);

        hunger = VARS.USER[PROPS.GAUGES][getObjectProperty(VARS.USER[PROPS.GAUGES], 'USER_GAUGES_H', 3)!];
        if (hunger >= 1) break;
      }

      if (hunger >= 1) break;
    }
  }

  const thirsty: number = VARS.USER[PROPS.GAUGES][getObjectProperty(VARS.USER[PROPS.GAUGES], 'USER_GAUGES_T', 4)!];
  if (thirsty < 0.45) {
    if (VARS.USER[PROPS.INVENTORY][n][INVENTORY_ID.BOTTLE_FULL])
      VARS.CLIENT[PROPS.SELECT_INV](INVENTORY_ID.BOTTLE_FULL);
  }
}