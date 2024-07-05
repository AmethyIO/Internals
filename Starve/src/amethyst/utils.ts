import { globalObject } from "@/core/utils";

const base24Chars: string = '0123456789ABCDEFGHIJKLMN';

function decimalToBase24(num: number) {
  let base24 = '';
  while (num > 0) {
    let remainder = num % 24;
    base24 = base24Chars[remainder] + base24;
    num = Math.floor(num / 24);
  }
  return base24 || '0';
}

export function caesarShift(str: string, amount: number) {
  if (amount < 0)
    return caesarShift(str, amount + 26);

  let output = "";
  for (let i = 0; i < str.length; i++) {
    let c = str[i];
    if (c.match(/[a-z]/i)) {
      const code = str.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        c = globalObject.String.fromCharCode(((code - 65 + amount) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        c = globalObject.String.fromCharCode(((code - 97 + amount) % 26) + 97);
      }
    }
    output += c;
  }
  return output;
}

export function encrypt(str: string) {
  let encrypted = '';
  
  for (let i = 0; i < str.length; i++) {
    let ascii = str.charCodeAt(i);
    let base24 = decimalToBase24(ascii);

    base24 = base24.padStart(2, '0');
    encrypted += base24;
  }

  return encrypted;
}