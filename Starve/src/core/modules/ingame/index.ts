export * from './autofarm';
export * from './autocraft';

import { initializeAutobook } from './autobook';
import { initializeAutofood } from './autofood';

export const TO_INITIALIZE_WITHOUT_ENABLING = [
  initializeAutobook,
  initializeAutofood,
];
export const TO_INITIALIZE_WITHOUT_ENABLING_L = TO_INITIALIZE_WITHOUT_ENABLING.length;