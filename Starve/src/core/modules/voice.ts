// Voice chat module
import { settings } from "../constants";

let initialized: boolean = false;

export function initializeVoiceModule(): void {
  if (settings.voicechat.enabled && initialized)
    return;

  
}