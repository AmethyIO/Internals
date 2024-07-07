// Voice chat module

import type { Vector } from "@/core/types";
import { GLOBAL, settings } from "../../constants";
import { getAudioStream, globalObject, StreamSplit } from "@/core/utils";
import Peer, { MediaConnection } from "peerjs";
import { AmethystPlayer } from "@/amethyst/components";

const SOUND_CUTOFF_RANGE = 400;
const SOUND_NEAR_RANGE = 100;

export function calcVolumes(listenerPos: Vector, soundPos: Vector) {
  const theta = globalObject.Math.atan2(soundPos.y - listenerPos.y, soundPos.x - listenerPos.x);
  const dist = globalObject.Math.hypot(soundPos.y - listenerPos.y, soundPos.x - listenerPos.x);
  const scale = 1 - (dist - SOUND_NEAR_RANGE) / (SOUND_CUTOFF_RANGE - SOUND_NEAR_RANGE);

  // target is too far away, no volume
  if (dist > SOUND_CUTOFF_RANGE)
    return [0, 0];

  // target is very close, max volume
  if (dist < SOUND_NEAR_RANGE)
    return [1, 1];

  const cos = globalObject.Math.cos(theta);
  const sin = globalObject.Math.sin(theta);

  return [
    (globalObject.Math.pow((cos < 0 ? cos : 0), 2) + globalObject.Math.pow(sin, 2)) * scale,
    (globalObject.Math.pow((cos > 0 ? cos : 0), 2) + globalObject.Math.pow(sin, 2)) * scale,
  ];
}

let container: HTMLDivElement | undefined = undefined;
let initialized: boolean = false;
let peerInstance: Peer | undefined = undefined;

function playAudioStream(stream: MediaStream, target: string): void {
  const elem = document.createElement('video');
  elem.srcObject = stream;
  elem.setAttribute('data-peer', target);
  elem.onloadedmetadata = () => elem.play();

  if (container) {
    container.appendChild(elem);
  } else {
    console.error('Audio stream container not found');
  }
}

export function initializeVoicePeer(): void {
  if (!initialized) return;
  if (peerInstance) return;

  peerInstance = new Peer(`${GLOBAL.SOCKET_UUID}_${GLOBAL.SOCKET_CURRENT_ROOM}`, {
    host: GLOBAL.API_HOST,
    path: '/realtime',
    config: { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }], 'sdpSemantics': 'unified-plan' },
    debug: 3
  });

  console.log('peer', peerInstance);

  peerInstance.on('open', id => console.log('realtime peerid', id));
  peerInstance.on('error', error => console.log('peer error', error))
  peerInstance.on('disconnected', id => console.log('disconnected from realtime peer'));

  peerInstance.on('call', async call => {
    console.log('realtime call from', call.peer);

    call.answer(await getAudioStream());
    receiveVoiceCall(call);
  });
}

export async function initializeVoiceModule(): Promise<void> {
  if (settings.voicechat.enabled && initialized)
    return;

  await getAudioStream();

  console.log('voice module initialized');
  container = globalObject.document.createElement('div');
  if (container) {
    container.style.visibility = 'hidden';
    globalObject.document.body.appendChild(container);
  }

  initialized = true;
}

export async function callVoicePeer(target: string) {
  if (!peerInstance) return;
  const call = peerInstance.call(target, await getAudioStream());
  receiveVoiceCall(call);
}

function receiveVoiceCall(call: MediaConnection) {
  console.log('receive');

  call.on('stream', stream => {
    let player: AmethystPlayer | undefined = undefined;
    for (const [ pid, p ] of globalObject.Object.entries(GLOBAL.AMETHYST_PLAYERS)) {
      if (p && p instanceof AmethystPlayer) {
        if (p.peerId === call.peer) {
          player = p;
          break;
        }
      }
    }
    
    if (!player) {
      console.log('couldn\'t find player for stream', call.peer);
    } else {
      player.stream = new StreamSplit(stream);
      playAudioStream(stream, call.peer);
    }
  });
}

export function destroyVoicePeer(): void {
  if (!initialized)
    return;

  if (peerInstance) {
    peerInstance.destroy();
    peerInstance = undefined;

    for (const [ pid, p ] of globalObject.Object.entries(GLOBAL.AMETHYST_PLAYERS)) {
      if (p && p instanceof AmethystPlayer) {
        if (p.stream) {
          p.stream.close();
        }
      }
    }
  }
}