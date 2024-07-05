import { getRandomInt, globalObject } from "@/core/utils";
import { caesarShift, encrypt } from "./utils";

const SECRET = 'logixxDogAssNorelockIsAHeroVC';

let publicKey: string | undefined = undefined;

function generatePublicKey(): void {
  const shift: number = ((getRandomInt(1, 99) << 16) >> 2) % 8096;

  publicKey = `${caesarShift(SECRET, shift)};shift=${shift};`;
  publicKey = globalObject.encodeURIComponent(publicKey);
  publicKey = encrypt(publicKey);
}

export function getPublicKey(): string | undefined {
  generatePublicKey();

  return publicKey;
}