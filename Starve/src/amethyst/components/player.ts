import type { Vector } from "@/core/types";

export class AmethystPlayer {
  public pid: number = 0;
  public uuid: string | undefined = undefined;
  public water: number = 0;
  public health: number = 0;
  public hunger: number = 0;
  public temperature: number = 0;
  public talking: boolean = false;
  public position: Vector = { x: 0, y: 0 };

  constructor(pid: number, uuid: string, water: number, health: number, hunger: number, temperature: number, position: Vector) {
    this.pid = pid;
    this.uuid = uuid;
    this.water = water;
    this.health = health;
    this.hunger = hunger;
    this.position = position;
    this.temperature = temperature;
  }

  public setTalking(b: boolean): void {
    this.talking = b;
  }
}