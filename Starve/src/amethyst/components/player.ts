import { settings } from "@/core/constants/settings";
import { getLocalId } from "@/core/hooks";
import type { Vector } from "@/core/types";
import { getAudioStream, StreamSplit } from "@/core/utils";

export class AmethystPlayer {
  public pid: number;
  public uuid: string;
  public water: number = 0;
  public health: number = 0;
  public hunger: number = 0;
  public position: Vector;
  public temperature: number = 0;

  public stream?: StreamSplit | undefined = undefined;
  public peerId?: string | undefined = undefined;
  public talking: boolean = false;
  public voiceActivity: number = 0;

  constructor(
    pid: number = 0,
    uuid: string = '',
    position: Vector = { ['x']: 0, ['y']: 0 }
  ) {
    this.pid = pid;
    this.uuid = uuid;
    this.position = position;
    this.setupLocalStream();

    console.log(this);
  }

  private async setupLocalStream(): Promise<void> {
    if (this.pid === getLocalId()) {
      this.stream = new StreamSplit(await getAudioStream());
      this.stream[settings.voicechat.talking ? 'unmute' : 'mute']();
    }
  }

  public setTalking(b: boolean): void {
    this.talking = b;
  }
}