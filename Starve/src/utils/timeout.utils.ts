import { globalObject } from "./global.utils";

export const sleep = (ms: number): Promise<any> => new globalObject.Promise(resolve => globalObject.setTimeout(resolve, ms));