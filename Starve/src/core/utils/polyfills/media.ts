import { globalObject } from '../global';

export async function getAudioStream(): Promise<MediaStream> {
  return await globalObject.navigator.mediaDevices.getUserMedia({ audio: true });
}

interface StreamSplitConfig {
  left?: number;
  right?: number;
}

export class StreamSplit {
  private stream: MediaStream;
  private context: AudioContext;
  private source: MediaStreamAudioSourceNode;
  private analyser: AnalyserNode;
  private channels: {
    left: GainNode;
    right: GainNode;
  };
  private destination: MediaStreamAudioDestinationNode;
  private dataArray: Uint8Array;

  constructor(stream: MediaStream, { left = 0, right = 0 }: StreamSplitConfig = {}) {
    this.stream = stream;

    const track = stream.getAudioTracks()[0];
    this.context = new AudioContext();
    this.source = this.context.createMediaStreamSource(new MediaStream([track]));

    this.channels = {
      left: this.context.createGain(),
      right: this.context.createGain(),
    };

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 256;  // Smaller FFT size for faster calculations
    this.source.connect(this.analyser);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.source.connect(this.channels.left);
    this.source.connect(this.channels.right);

    const merger = this.context.createChannelMerger(2);
    this.channels.left.connect(merger, 0, 0);
    this.channels.right.connect(merger, 0, 1);

    this.setVolume(left, right);

    merger.connect(this.context.destination);

    this.destination = this.context.createMediaStreamDestination();
  }

  setVolume(left: number = 0, right: number = 0): void {
    left = Math.max(Math.min(left, 1), 0);
    right = Math.max(Math.min(right, 1), 0);

    this.stream.getAudioTracks().forEach(track => {
      track.enabled = left !== 0 || right !== 0;
    });

    this.channels.left.gain.value = left;
    this.channels.right.gain.value = right;
  }

  getVoiceActivity(): number {
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const voiceActivity = sum / this.dataArray.length / 255;
    console.log('Voice Activity:', voiceActivity); // Debug log
    return voiceActivity;
  }

  close(): Promise<void> {
    return this.context.close();
  }

  mute() {
    this.stream.getAudioTracks()[0].enabled = false;
  }

  unmute() {
    this.stream.getAudioTracks()[0].enabled = true;
  }
}
