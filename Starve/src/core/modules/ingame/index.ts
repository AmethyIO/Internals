export * from './voice';
export * from './autofarm';
export * from './autocraft';

import { initializeAutobook } from './autobook';

export const TO_INITIALIZE_WITHOUT_ENABLING = [
  initializeAutobook,
];
export const TO_INITIALIZE_WITHOUT_ENABLING_L = TO_INITIALIZE_WITHOUT_ENABLING.length;