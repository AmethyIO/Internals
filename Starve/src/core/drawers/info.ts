import { extras, extras_length, getExtractorTypeName, ICON_MICROPHONE, infos, UNITS } from '@/core/constants';
import { VARS, PROPS, getObjectProperty } from '@/core';
import { getReadableTime, isArray } from '@/core/utils';
import { getCameraPosition, getPlayerByPid } from '@/core/hooks';

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
              .replace('$pid', pid)
              .replace('$info', info)

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
              .replace('$type', getExtractorTypeName(type))
              .replace('$time', time)
              .replace('$input', 'x' + input)
              .replace('$output', 'x' + output)

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

export function drawTotemInfo(context: CanvasRenderingContext2D): void {
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

  const totems = units[UNITS.TOTEM];
  if (!totems || !isArray(totems)) return;

  const totems_length = totems.length;
  for (let i = 0; i < totems_length; i++) {
    const totem = totems[i];

    if (totem) {
      const x = totem[getObjectProperty(totem, 'UNIT_X', 4)!];
      const y = totem[getObjectProperty(totem, 'UNIT_Y', 5)!];
      const pid = totem[getObjectProperty(totem, 'UNIT_PID', 2)!];
      const info = totem[getObjectProperty(totem, 'UNIT_INFO', 9)!];

      const locked = info >= 16;

      const owner = getPlayerByPid(pid);
      const count = locked ? info % 16 : info;

      let text_y = 0;
      const text = infos[UNITS.TOTEM]['strings'];
      const text_length = text.length;
      if (text_length > 0) {
        for (let j = 0; j < text_length; j++) {
          const t = text[j]
            .replace('$owner', owner ? owner.nickname || 'Unknown' : 'Unknown')
            .replace('$people', count)
            .replace('$locked', locked ? "🔒" : "🔓")

          context.strokeText(t, x + cam_x, y + cam_y + text_y);
          context.fillText(t, x + cam_x, y + cam_y + text_y);
          text_y += 16;
        }
      }
    }
  }

  context.restore();
}

export function drawEmeraldInfo(context: CanvasRenderingContext2D): void {
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

  const emeralds = units[UNITS.EMERALD_MACHINE];
  if (!emeralds || !isArray(emeralds)) return;

  const emeralds_length = emeralds.length;

  for (let i = 0; i < emeralds_length; i++) {
    const emerald = emeralds[i];

    if (emerald) {
      const x = emerald[getObjectProperty(emerald, 'UNIT_X', 4)!];
      const y = emerald[getObjectProperty(emerald, 'UNIT_Y', 5)!];
      const pid = emerald[getObjectProperty(emerald, 'UNIT_PID', 2)!];

      const owner = getPlayerByPid(pid);

      let text_y = 0;
      const text = infos[UNITS.EMERALD_MACHINE]['strings'];
      const text_length = text.length;
      if (text_length > 0) {
        for (let j = 0; j < text_length; j++) {
          const t = text[j]
            .replace('$owner', owner ? owner.nickname || 'Unknown' : 'Unknown')

          context.strokeText(t, x + cam_x, y + cam_y + text_y);
          context.fillText(t, x + cam_x, y + cam_y + text_y);
          text_y += 16;
        }
      }
    }
  }

  context.restore();
}

export function drawWindmillInfo(context: CanvasRenderingContext2D): void {
  if (!VARS.USER[PROPS.ALIVE]) return;

  const [cam_x, cam_y] = getCameraPosition();

  const units = VARS.WORLD[PROPS.UNITS];
  if (!isArray(units) || units.length === 0) return;

  const windmills = units[UNITS.WINDMILL];
  if (!isArray(windmills) || !windmills) return;

  const windmills_length: number = windmills.length;
  if (windmills_length === 0) return;

  context.save();
  context.font = '16px Baloo Paaji';
  context.lineWidth = 2;
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.strokeStyle = 'black';

  for (let i = 0; i < windmills_length; i++) {
    const windmill = windmills[i];

    if (windmill) {
      const x = windmill[getObjectProperty(windmill, 'UNIT_X', 4)!];
      const y = windmill[getObjectProperty(windmill, 'UNIT_Y', 5)!];
      const info = windmill[getObjectProperty(windmill, 'UNIT_INFO', 9)!];

      const input = info & 0xFF;
      const output = (info & 0xFF00) >> 8;
      const time = getReadableTime(input > 0 ? (((input / 2) * 10) / 60) : 0);

      let text_y = 0;
      const text = infos[UNITS.WINDMILL]['strings'];
      const text_length = text.length;
      if (text_length > 0) {
        for (let j = 0; j < text_length; j++) {
          const t = text[j]
            .replace('$time', time)
            .replace('$input', 'x' + input)
            .replace('$output', 'x' + output)

          context.strokeText(t, x + cam_x, y + cam_y + text_y);
          context.fillText(t, x + cam_x, y + cam_y + text_y);
          text_y += 16;
        }
      }
    }
  }

  context.restore();
}

export function drawOvenInfo(context: CanvasRenderingContext2D): void {
  if (!VARS.USER[PROPS.ALIVE]) return;

  const [cam_x, cam_y] = getCameraPosition();

  const units = VARS.WORLD[PROPS.UNITS];
  if (!isArray(units) || units.length === 0) return;

  const ovens = units[UNITS.BREAD_OVEN];
  if (!isArray(ovens) || !ovens) return;

  const ovens_length: number = ovens.length;
  if (ovens_length === 0) return;

  context.save();
  context.font = '16px Baloo Paaji';
  context.lineWidth = 2;
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.strokeStyle = 'black';

  for (let i = 0; i < ovens_length; i++) {
    const oven = ovens[i];

    if (oven) {
      const x = oven[getObjectProperty(oven, 'UNIT_X', 4)!];
      const y = oven[getObjectProperty(oven, 'UNIT_Y', 5)!];
      const info = oven[getObjectProperty(oven, 'UNIT_INFO', 9)!];

      const input = info & 0x1F;
      const input2 = (info & 0x3E0) >> 5;
      const output = (info & 0x7C00) >> 10;
      const time = getReadableTime(input2 > 0 ? (((input2 / 2) * 10) / 60) : 0);

      let text_y = 0;
      const text = infos[UNITS.BREAD_OVEN]['strings'];
      const text_length = text.length;
      if (text_length > 0) {
        for (let j = 0; j < text_length; j++) {
          const t = text[j]
            .replace('$time', time)
            .replace('$input', 'x' + input)
            .replace('$input2', 'x' + input2)
            .replace('$output', 'x' + output)

          context.strokeText(t, x + cam_x, y + cam_y + text_y);
          context.fillText(t, x + cam_x, y + cam_y + text_y);
          text_y += 16;
        }
      }
    }
  }

  context.restore();
}