import { UNITS } from "@/constants";
import { VARS, PROPS, getObjectProperty, getCameraPosition } from "@/core";
import { isArray } from "@/utils";

// {
//   "type": 0, // 1
//   "ᐃⲆᐃᐃ": 1, // 2
//   "id": 0, // 3
//   "x": 10000, // 4
//   "y": 7400, // 5
//   "angle": 0.24756862462040463, // 6
//   "ᐃΔⵠΔⲆᐃΔ": 0.24756862462040463, // 7
//   "action": 64, // 8
//   "info": 7, // 9
//   "ⲆⲆᐃⲆⲆ": 0, // 10
//   "r": { // 11
//     "x": 10000, // 1
//     "y": 7400 // 2
//   },
//   "ᐃᐃᐃᐃᐃ": 0, // 12
//   "ⵠΔⵠᐃ": 1000, // 13
//   "ⵠⲆΔⲆ": { // 14
//     "ⵠᐃΔⵠⲆ": "norelock", // 1
//     "ᐃΔᐃᐃ": 0, // 2
//     "ΔᐃᐃΔⵠ": 0, // 3
//     "ᐃⲆⵠΔⵠ": 0, // 4
//     "ΔᐃΔⲆᐃⵠⲆ": 0, // 5
//     "ⲆᐃᐃᐃΔ": 0, // 6
//     "ⲆⲆΔΔΔ": 1, // 7
//     "ᐃΔⲆⲆΔ": 0, // 8
//     "level": 0, // 9
//     "label": {}, // 10
//     "ⲆⵠΔΔᐃᐃⲆ": null, // 11
//     "ᐃΔΔΔᐃᐃⵠ": null, // 12
//     "ⲆᐃⵠⲆⲆ": true, // 13
//     "ᐃⲆⵠⵠⲆ": 0 // 14
//   },
//   "ᐃΔᐃᐃ": 0, // 15
//   "ΔᐃΔⲆᐃⵠⲆ": 0, // 16
//   "ⲆᐃᐃᐃΔ": 0, // 17
//   "ΔᐃᐃΔⵠ": 0, // 18
//   "ⵠᐃΔᐃΔΔⲆ": 5280, // 19
//   "ⲆⵠᐃΔΔ": -1000000, // 20
//   "Δᐃⵠⵠᐃ": -1000000, // 21
//   "ⲆΔᐃΔᐃ": -1000000, // 22
//   "ⵠᐃΔⵠΔⵠᐃ": -1000000, // 23
//   "ⵠⲆΔᐃΔ": -1000000, // 24
//   "ᐃΔᐃⲆⵠ": false, // 25
//   "ⲆⲆᐃΔⵠⲆΔ": false, // 26
//   "ΔΔᐃΔΔⲆᐃ": false, // 27
//   "ⵠᐃᐃⵠΔ": [], // 28
//   "ᐃⵠⵠᐃΔᐃⲆ": 0, // 29
//   "ᐃⵠΔᐃ": true, // 30
//   "ⵠᐃⲆⲆΔⵠᐃ": 0, // 31
//   "ⲆᐃΔⲆⲆⲆⵠ": 0, // 32
//   "ΔⵠⵠⵠΔ": [], // 33
//   "ᐃⲆΔᐃⲆ": 0, // 34
//   "ⲆⵠΔⵠΔ": 0, // 35
//   "ⲆⵠⵠΔᐃ": 0, // 36
//   "ⵠⲆᐃⵠⵠᐃᐃ": { // 37
//     "ᐃⵠⲆ": false,
//     "ᐃⲆΔ": 0,
//     "max": 0,
//     "min": -0.5235987755982988,
//     "ᐃᐃᐃᐃᐃᐃΔ": 0.5,
//     "ΔⵠⵠⵠⵠΔᐃ": 1,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "ⲆⵠⲆᐃᐃ": 0, // 38
//   "ΔⲆⲆⲆⲆⲆⵠ": 0, // 39
//   "ᐃᐃᐃ": { // 40
//     "ᐃⵠⲆ": false,
//     "ᐃⲆΔ": 0.6,
//     "max": 0.6,
//     "min": 0,
//     "ᐃᐃᐃᐃᐃᐃΔ": 5,
//     "ΔⵠⵠⵠⵠΔᐃ": 3,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "ΔⲆΔᐃⲆ": { // 41
//     "ᐃⵠⲆ": false,
//     "ᐃⲆΔ": 0.6,
//     "max": 0.6,
//     "min": 0,
//     "ᐃᐃᐃᐃᐃᐃΔ": 5,
//     "ΔⵠⵠⵠⵠΔᐃ": 3,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "freeze": { // 42
//     "ᐃⵠⲆ": false,
//     "ᐃⲆΔ": 0.6,
//     "max": 0.6,
//     "min": 0,
//     "ᐃᐃᐃᐃᐃᐃΔ": 5,
//     "ΔⵠⵠⵠⵠΔᐃ": 3,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "ⵠΔᐃⲆᐃᐃᐃ": { // 43
//     "ᐃⵠⲆ": false,
//     "ᐃⲆΔ": 0.6,
//     "max": 0.6,
//     "min": 0,
//     "ᐃᐃᐃᐃᐃᐃΔ": 5,
//     "ΔⵠⵠⵠⵠΔᐃ": 3,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "ᐃᐃᐃΔⲆⵠⲆ": { // 44
//     "ᐃⵠⲆ": true,
//     "ᐃⲆΔ": 2.0643749999999996,
//     "max": 2.25,
//     "min": -1.5,
//     "ᐃᐃᐃᐃᐃᐃΔ": 3.75,
//     "ΔⵠⵠⵠⵠΔᐃ": 7.5,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "ⲆⵠⵠⵠⵠΔᐃ": { // 45
//     "ᐃⵠⲆ": true,
//     "ᐃⲆΔ": 0,
//     "max": 7.5,
//     "min": -3,
//     "ᐃᐃᐃᐃᐃᐃΔ": 22.5,
//     "ΔⵠⵠⵠⵠΔᐃ": 33.75,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "attack": { // 46
//     "ᐃⵠⲆ": false,
//     "ᐃⲆΔ": 0,
//     "max": 0,
//     "min": -1.0471975511965976,
//     "ᐃᐃᐃᐃᐃᐃΔ": 6,
//     "ΔⵠⵠⵠⵠΔᐃ": 9,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "ⵠᐃⵠⵠⲆⵠΔⲆⵠ": 0.58, // 47
//   "ΔⲆᐃⵠΔⲆᐃ": { // 48
//     "ᐃⵠⲆ": false,
//     "ᐃⲆΔ": 0.6,
//     "max": 0.6,
//     "min": 0,
//     "ᐃᐃᐃᐃᐃᐃΔ": 1,
//     "ΔⵠⵠⵠⵠΔᐃ": 3,
//     "ⵠΔΔᐃⲆΔⵠ": 0
//   },
//   "ⲆΔΔᐃⲆⲆⵠ": 0, // 49
//   "ΔΔΔᐃⵠΔΔ": 0, // 50
//   "ⵠΔΔᐃᐃⵠⵠ": 0, // 51
//   "ΔⵠΔΔᐃΔⵠ": [], // 52
//   "ᐃⲆⵠⲆΔⵠⵠ": [], // 53
//   "text": [], // 54
//   "label": [], // 55
//   "ⲆᐃΔⵠΔ": false, // 56
//   "right": -1, // 57
//   "Ⲇⵠᐃⵠⵠ": 0, // 58
//   "ᐃⲆⵠᐃⲆᐃᐃ": false, // 59
//   "ᐃⵠᐃⵠⲆ": 0, // 60
//   "ΔⵠΔᐃⵠ": false, // 61
//   "bubbles": [], // 62
//   "ᐃⲆⵠΔⵠ": 0, // 63
//   "ⵠᐃⲆⵠⵠ": -1, // 64
//   "ᐃⵠΔᐃΔ": false // 65
// }

const infos = {
  [UNITS.PLAYERS]: {
    ['strings']: [
      "PID: [pid]",
      "Info: [info]"
    ]
  },
  [UNITS.EXTRACTOR_MACHINE_AMETHYST]: {
    ['strings']: [
      "Extractor ID: [pid]",
    ]
  }
};

export const drawPlayerInfo = (context: CanvasRenderingContext2D): void => {
  if (!VARS.USER[PROPS.ALIVE]) return;

  const [cam_x, cam_y] = getCameraPosition();

  const units = VARS.WORLD[PROPS.UNITS];
  if (!isArray(units) || units.length === 0) return;

  const players = units[UNITS.PLAYERS];
  if (!isArray(players) || !players) return;

  const players_length: number = players.length;
  if (players_length === 0) return;

  context.save();
  context.font = '19px Baloo Paaji';
  context.lineWidth = 4;
  context.fillStyle = 'white';
  context.strokeStyle = 'black';

  for (let index = 0; index < players_length; index++) {
    const player = players[index];

    if (player) {
      const obj     = player[getObjectProperty(player, 'UNIT_OBJ', 14)!];
      
      if (obj) {
        const alive = obj[getObjectProperty(obj, 'PLAYER_ALIVE', 13)!];
        if (!alive) continue;

        const x     = player[getObjectProperty(player, 'UNIT_X', 4)!];
        const y     = player[getObjectProperty(player, 'UNIT_Y', 5)!];
        const pid   = player[getObjectProperty(player, 'UNIT_PID', 2)!];
        const info  = player[getObjectProperty(player, 'UNIT_INFO', 9)!];

        // Drawing multiple infos
        let text_y = 0;

        const text = infos[UNITS.PLAYERS]['strings'];
        const text_length = text.length;

        if (text_length > 0) {
          for (let j = 0; j < text_length; j++) {
            const t = text[j]
              .replace('[pid]', pid)
              .replace('[info]', info)

            context.strokeText(t, (x - 20) + cam_x, y + cam_y + text_y);
            context.fillText(t, (x - 20) + cam_x, y + cam_y + text_y);
            text_y += 22;
          }
        }
      }
    }
  }

  context.restore();
};

// export const drawInfos = (context: CanvasRenderingContext2D): void => {
//   if (!VARS.USER[PROPS.ALIVE])
//     return;
//   const [camX, camY] = getCameraPosition();
//   const units = VARS.WORLD[PROPS.UNITS];
//   if (!units || !isArray(units))
//     return;
//   const u_length = units.length;
//   context.save();
//   context.font = '19px Baloo Paaji';
//   context.lineWidth = 6;
//   context.fillStyle = 'white';
//   context.strokeStyle = 'black';
//   for (let i = 0; i < u_length; i++) {
//     const unit = units[i];
//     if (!unit || !isArray(unit))
//       continue;
//     const length = unit.length;
//     for (let j = 0; j < length; j++) {
//       const item = unit[j];
//       if (item) {
//         const type = item[getObjectProperty(item, 1)!];
//         if (type in infos) {
//           const x = item[getObjectProperty(item, 4)!];
//           const y = item[getObjectProperty(item, 5)!];
//           const pid = item[getObjectProperty(item, 2)!];
//           const _info = infos[type];
//           if (_info.strings.length > 0) {
//             let _y = 0;
//             for (let k = 0; k < _info.strings.length; k++) {
//               let info = _info.strings[k];
//               info = info.replace('[pid]', pid);
//               context.strokeText(info, (x - 20) + camX, y + camY + _y);
//               context.fillText(info, (x - 20) + camX, y + camY + _y);
//               _y += 22.2;
//             }
//           }
//         }
//       }
//     }
//   }
//   context.restore();
// };