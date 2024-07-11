import type { Vector } from "@/core/types";
import { infinityClamp, smoothTween } from "@/core/utils";

const props = ['water', 'health', 'hunger', 'temperature'];

export class AmethystPlayer {
  public pid: number;
  public uuid: string;
  public water: number = 0;
  public health: number = 0;
  public hunger: number = 0;
  public position: Vector;
  public temperature: number = 0;

  constructor(
    pid: number = 0,
    uuid: string = '',
    position: Vector = { ['x']: 0, ['y']: 0 }
  ) {
    this.pid = pid;
    this.uuid = uuid;
    this.position = position;

    console.log(this);
  }

  public updateInfo(info: any) {
    for (let i = 0; i < props.length; i++) {
      const p_i = props[i] as any;

      if (info[p_i]) smoothTween((this as any)[p_i], info[p_i], 200, (value: number) => ((this as any)[p_i] = value))
    }
  }
}