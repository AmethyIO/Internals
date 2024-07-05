import { getObjectProperty, PROPS, VARS } from "../..";
import { INVENTORY_ID, settings, STATES, UNITS } from "../../constants";
import { getCameraPosition, getLocalPlayer } from "../../hooks";
import type { StrAny, Vector } from "../../types";
import { globalObject } from "../../utils";
import { getCanvas } from "../draw";

const pi2 = globalObject.Math.PI * 2;

let farming: boolean = false;
let localPlayer: any | undefined = undefined;

let initialized: boolean = false;

// Player position vectors
const position: Vector = {
  ['x']: 0,
  ['y']: 0
};
const positionABS: Vector = {
  ['x']: 0,
  ['y']: 0
};

// Rectangle object for autofarm area
const rectangle: StrAny = {};
rectangle.x = 0;
rectangle.y = 0;
rectangle.width = 0;
rectangle.height = 0;

// List of object types to be farmed
const OBJECTS_DETECT = [
  UNITS.SEED,
  UNITS.WHEAT_SEED,
  UNITS.GARLIC_SEED,
  UNITS.CARROT_SEED,
  UNITS.TOMATO_SEED,
  UNITS.PUMPKIN_SEED,
  UNITS.ALOE_VERA_SEED,
  UNITS.THORNBUSH_SEED,
  UNITS.WATERMELON_SEED
];
const OBJECTS_DETECT_LEN = OBJECTS_DETECT.length;

// TODO
// List of object to be ignored
const OBJECTS_IGNORE = [
  UNITS.GOLD_SPIKE,
  UNITS.STONE_SPIKE,
  UNITS.REIDITE_SPIKE,
  UNITS.AMETHYST_SPIKE,

  UNITS.WOOD_DOOR_SPIKE,
  UNITS.STONE_DOOR_SPIKE,
  UNITS.REIDITE_DOOR_SPIKE,
  UNITS.AMETHYST_DOOR_SPIKE,
];
const OBJECTS_IGNORE_LEN = OBJECTS_IGNORE.length;

// TODO: those functions to be patched automatically

/**
 * Calculate the distance between two points.
 *
 * @param p1 - The first point.
 * @param p2 - The second point.
 * @returns The distance between p1 and p2.
 */
function getDistance(p1: Vector, p2: Vector) {
  return globalObject.Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/**
 * Calculate the angle between two points.
 *
 * @param point1 - The first point.
 * @param point2 - The second point.
 * @param useRelativeCoordinates - Whether to use relative coordinates.
 * @returns The angle between point1 and point2.
 */
function calculateAngle(point1: any, point2: any, useRelativeCoordinates: boolean) {
  if (point1 && point2) {
    if (useRelativeCoordinates) {
      return globalObject.Math.atan2(point2.r.y - point1.r.y, point2.r.x - point1.r.x);
    } else {
      return globalObject.Math.atan2(point2.y - point1.y, point2.x - point1.x);
    }
  }
}

/**
 * Select the pitchfork item in the player's inventory.
 */
function selectPitchfork(): void {
  if (!localPlayer) return;

  const n = getObjectProperty(VARS.USER[PROPS.INVENTORY], 'INVENTORY_N', 4)!;
  const right = getObjectProperty(localPlayer, 'UNIT_RIGHT', 61)!;

  if (
    VARS.USER[PROPS.INVENTORY][n][INVENTORY_ID.PITCHFORK2]
    && localPlayer[right] !== INVENTORY_ID.PITCHFORK2
  ) {
    VARS.CLIENT[PROPS.SELECT_INV](INVENTORY_ID.PITCHFORK2);
  } else if (
    VARS.USER[PROPS.INVENTORY][n][INVENTORY_ID.PITCHFORK]
    && localPlayer[right] !== INVENTORY_ID.PITCHFORK
  ) {
    VARS.CLIENT[PROPS.SELECT_INV](INVENTORY_ID.PITCHFORK);
  }
}

/**
 * Switch the autofarm process based on settings.
 */
export function processAutofarmSwitch(): void {
  if (settings.autofarm.enabled && !initialized)
    initializeAutofarm();
}

/**
 * Initialize the autofarm process.
 */
function initializeAutofarm(): void {
  if (initialized || !settings.autofarm.enabled) return;

  processAutofarm();
  globalObject.setInterval(processAutofarm, 300);

  initialized = true;
}

/**
 * Main process function for the autofarm feature.
 */
function processAutofarm(): void {
  if (!initialized) return;

  localPlayer = getLocalPlayer();
  if (!localPlayer) return;

  if (!settings.autofarm.enabled) {
    const action = getObjectProperty(localPlayer, 'UNIT_ACTION', 8)!;

    if ((localPlayer[action] & STATES.ATTACK && localPlayer[action] & STATES.WALK) && farming) {
      farming = false;

      VARS.CLIENT[PROPS.SEND_MOVE](0);
      VARS.CLIENT[PROPS.STOP_ATTACK]();
    }

    return;
  }

  const canvas = getCanvas();
  const rect = canvas.getBoundingClientRect();

  // Update rectangle for autofarm area
  rectangle.x = settings.autofarm.x;
  rectangle.y = settings.autofarm.y;
  rectangle.width = settings.autofarm.xx - rectangle.x;
  rectangle.height = settings.autofarm.yy - rectangle.y;

  // Target
  const target: StrAny = {};
  target.type = 0;
  target.info = 0;
  target.object = null;
  target.distance = -1;

  const mx = getObjectProperty(VARS.MOUSE[PROPS.POS], 'MOUSE_POS_X', 1)!;
  const my = getObjectProperty(VARS.MOUSE[PROPS.POS], 'MOUSE_POS_Y', 2)!;
  const px = localPlayer[getObjectProperty(localPlayer, 'UNIT_X', 4)!];
  const py = localPlayer[getObjectProperty(localPlayer, 'UNIT_Y', 5)!];
  const [cam_x, cam_y] = getCameraPosition();

  // Loop through objects and find the closest target within the autofarm area.
  for (let i = 0; i < OBJECTS_DETECT_LEN; i++) {
    const OBJECT_TYPE = OBJECTS_DETECT[i];

    const OBJECTS = VARS.WORLD[PROPS.UNITS][OBJECT_TYPE];
    const OBJECTS_LEN = OBJECTS.length;

    for (let j = 0; j < OBJECTS_LEN; j++) {
      const OBJECT = OBJECTS[j];

      if (OBJECT) {
        let distance = 0;

        const x = OBJECT[getObjectProperty(OBJECT, 'UNIT_X', 4)!];
        const y = OBJECT[getObjectProperty(OBJECT, 'UNIT_Y', 5)!];
        const info = OBJECT[getObjectProperty(OBJECT, 'UNIT_INFO', 9)!];

        const dried = info & 0x10;
        const amount = info & 0xF;

        if (info === 10 || amount === 0) continue;
        if (!settings.autofarm.autowater && dried) continue;

        if (rectangle.x < x - 50 + 100 && rectangle.x + rectangle.width > x - 50 && rectangle.y < y - 50 + 100 && rectangle.y + rectangle.height > y - 50) {
          distance = (px - x) ** 2 + (py - y) ** 2;

          if (target.distance === -1 || distance < target.distance) {
            target.info = info;
            target.object = OBJECT;
            target.distance = distance;
          }
        }
      }
    }

    if (target.object) {
      farming = true;

      target.distance = getDistance(localPlayer, target.object);
      target.info = target.object[getObjectProperty(target.object, 'UNIT_INFO', 9)!];

      switch (target.info) {
        case 1:
        case 2:
        case 3: {
          selectPitchfork();
          target.type = 2;
          break;
        }
        case 16:
        case 17:
        case 18:
        case 19: {
          if (settings.autofarm.autowater) {
            const n = getObjectProperty(VARS.USER[PROPS.INVENTORY], 'INVENTORY_N', 4)!;
            const right = getObjectProperty(localPlayer, 'UNIT_RIGHT', 61)!;

            if (VARS.USER[PROPS.INVENTORY][n][INVENTORY_ID.WATERING_CAN_FULL]) {
              if (localPlayer[right] !== INVENTORY_ID.WATERING_CAN_FULL)
                VARS.CLIENT[PROPS.SELECT_INV](INVENTORY_ID.WATERING_CAN_FULL);

              target.type = 1;
            }
          } else {
            selectPitchfork();
            target.type = 2;
          }

          break;
        }
      }

      position['x'] = px - target.object[getObjectProperty(target.object, 'UNIT_X', 4)!];
      position['y'] = py - target.object[getObjectProperty(target.object, 'UNIT_Y', 5)!];
      positionABS['x'] = globalObject.Math.abs(px - target.object[getObjectProperty(target.object, 'UNIT_X', 4)!]);
      positionABS['y'] = globalObject.Math.abs(py - target.object[getObjectProperty(target.object, 'UNIT_Y', 5)!]);

      let velocity = 0;

      if (positionABS.x > 0) {
        if (position.x > 0) velocity += 1;
        if (position.x < 0) velocity += 2;
      }

      if (positionABS.y > 80) {
        if (position.y > 0) velocity += 8;
        if (position.y < 0) velocity += 4;
      }

      if (positionABS.x < (target.type === 1 ? 300 : 300) && positionABS.y < (target.type === 1 ? 300 : 300)) {
        settings.autofarm.angle = calculateAngle(localPlayer, target.object, false)!;
        const angle = globalObject.Math.floor((((settings.autofarm.angle + pi2) % pi2) * 255) / pi2);

        if (settings.autofarm.angle !== 0) {
          const targetX = cam_x + target.object[getObjectProperty(target.object, 'UNIT_X', 4)!] - rect.left;
          const targetY = cam_y + target.object[getObjectProperty(target.object, 'UNIT_Y', 5)!] - rect.top;
          
          VARS.MOUSE[PROPS.POS][mx] = globalObject.Math.floor(targetX);
          VARS.MOUSE[PROPS.POS][my] = globalObject.Math.floor(targetY);

          VARS.CLIENT[PROPS.SEND_ANGLE](angle);
          VARS.CLIENT[PROPS.SEND_ATTACK](angle);
        }
      }

      VARS.CLIENT[PROPS.SEND_MOVE](velocity);

    } else {
      farming = false;

      VARS.CLIENT[PROPS.SEND_MOVE](0);
      VARS.CLIENT[PROPS.STOP_ATTACK]();
    }
  }
}