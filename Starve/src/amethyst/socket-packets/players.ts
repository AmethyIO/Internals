import { GLOBAL } from "@/core/constants";
import { AmethystPlayer } from "../components";

export function socketPlayerJoin(data: any): void {
  const player = data.gpid in GLOBAL.AMETHYST_PLAYERS;
  if (!player)
    GLOBAL.AMETHYST_PLAYERS[data.gpid] = new AmethystPlayer(data.gpid, data.uuid, data.pos);

  if (data.gpid in GLOBAL.AMETHYST_PLAYERS) {
    const obj = GLOBAL.AMETHYST_PLAYERS[data.gpid] as AmethystPlayer;

    obj.water = data.water;
    obj.health = data.health;
    obj.hunger = data.hunger;
    obj.temperature = data.temperature;
  }
}

export function socketPlayerLeft(data: any): void {
  const player = data.gpid in GLOBAL.AMETHYST_PLAYERS ? GLOBAL.AMETHYST_PLAYERS[data.gpid] as AmethystPlayer : undefined;
  if (player) {
    delete GLOBAL.AMETHYST_PLAYERS[data.gpid];
  }
}