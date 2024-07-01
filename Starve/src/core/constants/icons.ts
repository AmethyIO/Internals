import { globalObject } from '@/core/utils';

function createMicrophone() {
  const canvas = globalObject.document.createElement('canvas');
  const context = canvas.getContext('2d')!;

  context.save();

  context.miterLimit = 4;
  context.fillStyle = '#fff';
  context.scale(0.10714285714285715, 0.10714285714285715);
  context.scale(1.3333333333333333, 1.3333333333333333);

  context.save();

  context.translate(0, 560);
  context.scale(0.1, -0.1);

  context.save();

  context.fillStyle = '#fff';
  context.beginPath();
  context.moveTo(2676, 4834);
  context.bezierCurveTo(2471, 4784, 2296, 4604, 2240, 4384);
  context.bezierCurveTo(2221, 4310, 2220, 4270, 2220, 3520);
  context.bezierCurveTo(2220, 2770, 2221, 2730, 2240, 2656);
  context.bezierCurveTo(2298, 2430, 2481, 2244, 2688, 2201);
  context.bezierCurveTo(2877, 2162, 3059, 2218, 3200, 2359);
  context.bezierCurveTo(3288, 2447, 3340, 2538, 3370, 2656);
  context.bezierCurveTo(3389, 2730, 3390, 2770, 3390, 3520);
  context.bezierCurveTo(3390, 4270, 3389, 4310, 3370, 4384);
  context.bezierCurveTo(3288, 4706, 2978, 4907, 2676, 4834);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
  context.save();

  context.fillStyle = '#fff';
  context.beginPath();
  context.moveTo(1514, 2625);
  context.bezierCurveTo(1556, 2024, 1954, 1525, 2505, 1385);
  context.lineTo(2595, 1362);
  context.lineTo(2598, 1056);
  context.lineTo(2600, 750);
  context.lineTo(2805, 750);
  context.lineTo(3010, 750);
  context.lineTo(3012, 1056);
  context.lineTo(3015, 1362);
  context.lineTo(3105, 1385);
  context.bezierCurveTo(3539, 1496, 3882, 1827, 4029, 2278);
  context.bezierCurveTo(4066, 2391, 4088, 2502, 4096, 2625);
  context.lineTo(4103, 2720);
  context.lineTo(3891, 2720);
  context.lineTo(3680, 2720);
  context.lineTo(3680, 2658);
  context.bezierCurveTo(3679, 2518, 3618, 2331, 3528, 2192);
  context.bezierCurveTo(3267, 1791, 2756, 1671, 2360, 1918);
  context.bezierCurveTo(2231, 1998, 2098, 2145, 2028, 2285);
  context.bezierCurveTo(1972, 2396, 1930, 2561, 1930, 2666);
  context.lineTo(1930, 2720);
  context.lineTo(1719, 2720);
  context.lineTo(1507, 2720);
  context.lineTo(1514, 2625);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
  context.restore();
  context.restore();

  return canvas;
}

export const ICON_MICROPHONE = createMicrophone();