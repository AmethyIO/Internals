import type { StrAny } from "../types";

export const GLOBAL: StrAny = {};
GLOBAL.API_HOST = process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'amethyst.norelock.dev';
GLOBAL.LAST_CRAFT = undefined;

GLOBAL.SOCKET_UUID = undefined;
GLOBAL.SOCKET_CURRENT_ROOM = undefined;
GLOBAL.SOCKET_AVAILABLE_ROOMS = [];

GLOBAL.AMETHYST_PLAYERS = {};