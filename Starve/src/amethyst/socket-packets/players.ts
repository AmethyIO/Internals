import { GLOBAL } from "@/core/constants";
import { AmethystPlayer } from "../components";

export function socketPlayerJoin(data: any): void {
  const player = data.gpid in GLOBAL.AMETHYST_PLAYERS;
  if (!player)
    GLOBAL.AMETHYST_PLAYERS[data.gpid] = new AmethystPlayer(data.gpid, data.uuid, data.water, data.health, data.hunger, data.temperature, data.pos);
}

export function socketPlayerLeft(data: any): void {
  const player = data.gpid in GLOBAL.AMETHYST_PLAYERS;
  if (player) {
    delete GLOBAL.AMETHYST_PLAYERS[data.gpid];
  }
}