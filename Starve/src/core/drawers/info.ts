import { extras, extras_length, getExtractorTypeName, ICON_MICROPHONE, infos, UNITS } from '@/core/constants';
import { VARS, PROPS, getObjectProperty } from '@/core';
import { getReadableTime, isArray } from '@/core/utils';
import { getCameraPosition } from '@/core/hooks';

// temp
const USING_VOICE = true;

export function drawPlayerInfo (context: CanvasRenderingContext2D): void {
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
  context.textAlign = 'center';
  context.strokeStyle = 'black';

  for (let index = 0; index < players_length; index++) {
    const player = players[index];

    if (player) {
      const obj = player[getObjectProperty(player, 'UNIT_OBJ', 14)!];

      if (obj) {
        const alive = obj[getObjectProperty(obj, 'PLAYER_ALIVE', 13)!];
        if (!alive) continue;

        const x = player[getObjectProperty(player, 'UNIT_X', 4)!];
        const y = player[getObjectProperty(player, 'UNIT_Y', 5)!];
        const pid = player[getObjectProperty(player, 'UNIT_PID', 2)!];
        const info = player[getObjectProperty(player, 'UNIT_INFO', 9)!];

        // Badges, voice chat indicator
        context.save();

        // Voice bg
        if (USING_VOICE) {
          context.globalAlpha = 0.45;
          context.drawImage(ICON_MICROPHONE, (x - 25) + cam_x, (y - (ICON_MICROPHONE.height - 25)) + cam_y, 166, 70);
        }

        context.restore();

        // Drawing multiple infos
        let text_y = 0;

        const text = infos[UNITS.PLAYERS]['strings'];
        const text_length = text.length;

        if (text_length > 0) {
          for (let j = 0; j < text_length; j++) {
            const t = text[j]
              .replace('[pid]', pid)
              .replace('[info]', info)

            context.strokeText(t, x + cam_x, y + cam_y + text_y);
            context.fillText(t, x + cam_x, y + cam_y + text_y);
            text_y += 22;
          }
        }
      }
    }
  }

  context.restore();
};

export function drawExtractorInfo (context: CanvasRenderingContext2D): void {
  if (!VARS.USER[PROPS.ALIVE]) return;

  const [cam_x, cam_y] = getCameraPosition();

  const units = VARS.WORLD[PROPS.UNITS];
  if (!isArray(units) || units.length === 0) return;

  context.save();
  context.font = '16px Baloo Paaji';
  context.lineWidth = 2;
  context.fillStyle = 'white'; 
  context.textAlign = 'center';
  context.strokeStyle = 'black';

  for (let i = 0; i < extras_length; i++) {
    const extra = extras[i];

    const extractors = units[extra];
    if (!extractors || !isArray(extractors))
      continue;

    const extractors_length = extractors.length;

    for (let j = 0; j < extractors_length; j++) {
      const extractor = extractors[j];

      if (extractor) {
        const x = extractor[getObjectProperty(extractor, 'UNIT_X', 4)!];
        const y = extractor[getObjectProperty(extractor, 'UNIT_Y', 5)!];
        const type = extractor[getObjectProperty(extractor, 'UNIT_TYPE', 1)!];
        const info = extractor[getObjectProperty(extractor, 'UNIT_INFO', 9)!];

        const input = info & 0xFF;
        const output = (info & 0xFF00) >> 8;

        const time = getReadableTime(input > 0 ? (((input / 2) * 10) / 60) : 0);

        // Drawing multiple infos
        let text_y = 0;
        const text = infos['extractor']['strings'];
        const text_length = text.length;
        if (text_length > 0) {
          for (let j = 0; j < text_length; j++) {
            const t = text[j]
              .replace('[type]', getExtractorTypeName(type))
              .replace('[time]', time)
              .replace('[input]', 'x' + input)
              .replace('[output]', 'x' + output)

            context.strokeText(t, x + cam_x, y + cam_y + text_y);
            context.fillText(t, x + cam_x, y + cam_y + text_y);
            text_y += 16;
          }
        }
      }
    }
  }

  context.restore();
}