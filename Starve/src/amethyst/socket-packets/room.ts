import { GLOBAL } from "@/core/constants";
import { getSocket } from "../socket";
import { getLocalId } from "@/core/hooks";
import { sleep } from "@/core/utils";
import { AmethystPlayer } from "../components";

function socketJoinedRoom([room = '', players = []]): void {
  const socket = getSocket();
  if (!socket) return;

  if (GLOBAL.SOCKET_CURRENT_ROOM === undefined)
    GLOBAL.SOCKET_CURRENT_ROOM = room;

  const players_length = players.length;
  for (let index: number = 0; index < players_length; index++) {
    const player = players[index] as any;

    if (player) {
      if (!(player.gpid in GLOBAL.AMETHYST_PLAYERS)) {
        GLOBAL.AMETHYST_PLAYERS[player.gpid] = new AmethystPlayer(player.gpid, player.uuid, player.pos);
        const obj = GLOBAL.AMETHYST_PLAYERS[player.gpid] as AmethystPlayer;

        obj.water = player.water;
        obj.health = player.health;
        obj.hunger = player.hunger;
        obj.temperature = player.temperature;
      }
    }
  }
}

export function socketLeaveRoom(): void {
  const socket = getSocket();
  if (!socket) return;

  socket.emit('leave');
}

export async function socketJoinRoom(room: string): Promise<void> {
  const socket = getSocket();
  if (!socket) return;

  if (GLOBAL.SOCKET_CURRENT_ROOM !== undefined)
    return;

  while (GLOBAL.SOCKET_CURRENT_ROOM === undefined) {
    await sleep(50);

    const id = getLocalId();
    if (id !== 0) {
      socket.emit('join', [room, id]);
      break;
    }
  }

  socket.once('joined', socketJoinedRoom)
}