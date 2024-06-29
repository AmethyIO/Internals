import { globalObject } from '../global';

let mediaStream: MediaStream;

export function getLocalStream() {
  if (mediaStream)
    return mediaStream;

  globalObject.navigator.mediaDevices
    .getUserMedia({ ['video']: false, ['audio']: true })
    .then((stream) => {
      mediaStream = stream;
    })
    .catch((err) => {
      console.error(`Media error: ${err}`);
    });
}