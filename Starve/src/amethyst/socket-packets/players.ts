import { GLOBAL } from "@/core/constants";
import { AmethystPlayer } from "../components";
import { callVoicePeer } from "@/core/modules";
import { globalObject } from "@/core/utils";

export function socketPlayerJoin(data: any): void {
  const player = data.gpid in GLOBAL.AMETHYST_PLAYERS;
  if (!player)
    GLOBAL.AMETHYST_PLAYERS[data.gpid] = new AmethystPlayer(data.gpid, data.uuid, data.pos);

  if (data.gpid in GLOBAL.AMETHYST_PLAYERS) {
    const obj = GLOBAL.AMETHYST_PLAYERS[data.gpid] as AmethystPlayer;

    obj.water = data.water;
    obj.health = data.health;
    obj.hunger = data.hunger;
    obj.peerId = `${data.uuid}_${GLOBAL.SOCKET_CURRENT_ROOM}`;
    obj.temperature = data.temperature;
  }

  callVoicePeer(GLOBAL.AMETHYST_PLAYERS[data.gpid]['peerId']);
}

export function socketPlayerLeft(data: any): void {
  const player = data.gpid in GLOBAL.AMETHYST_PLAYERS ? GLOBAL.AMETHYST_PLAYERS[data.gpid] as AmethystPlayer : undefined;
  if (player) {
    const vc = globalObject.document.querySelector(`[data-peer="${player.peerId}"]`);
    if (vc) vc.remove();

    delete GLOBAL.AMETHYST_PLAYERS[data.gpid];
  }
}