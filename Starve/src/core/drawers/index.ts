import { updateCameraPosition, updatePlayers } from '../hooks';
import { drawExtractorInfo, drawPlayerInfo } from './info';
import { drawBase } from './main';
import { updateHooks } from './update';

// if i'm tired and bad, i'm doing actual next shit array *clap clap*
export const DRAWERS = [
  // Hooks
  updateHooks,
  updatePlayers,
  updateCameraPosition,

  // Actual draw things
  drawBase,
  drawPlayerInfo,
  drawExtractorInfo,
];