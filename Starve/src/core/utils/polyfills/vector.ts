import type { Vector } from '@/core/types';

export const copy_vector = (source: Vector, target: Vector): void => {
  target.x = source.x;
  target.y = source.y;
};

export const get_vector = (v1: Vector, v2: Vector): Vector => {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
};

export const mul_vector = (v: Vector, mul: number): void => {
  v.x *= mul;
  v.y *= mul;
};

export const scalar_product = (v1: Vector, v2: Vector): number => v1.x * v2.x + v1.y * v2.y;

export const norm = (v: Vector): number => Math.sqrt(v.x * v.x + v.y * v.y);

export const cross_product = (v1: Vector, v2: Vector): number => v1.x * v2.y - v1.y * v2.x;

export const get_angle = (v1: Vector, v2: Vector): number => Math.acos(scalar_product(v1, v2) / (norm(v1) * norm(v2))) * Math.sign(cross_product(v1, v2));

export const dist = (a: Vector, b: Vector): number => Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));

export const build_vector = (d: number, a: number): Vector => {
  return { x: Math.cos(a) * d, y: Math.sin(a) * d };
};

export const add_vector = (source: Vector, target: Vector): void => {
  source.x += target.x;
  source.y += target.y;
};

export const sub_vector = (source: Vector, target: Vector): void => {
  source.x -= target.x;
  source.y -= target.y;
};

export const translate_vector = (v: Vector, x: number, y: number): void => {
  v.x += x;
  v.y += y;
};

export const translate_new_vector = (v: Vector, x: number, y: number): Vector => {
  return { x: v.x + x, y: v.y + y };
};

export const get_std_angle = (o1: Vector, o2: Vector): number => get_angle({ x: 1, y: 0 }, get_vector(o1, o2));

export const middle_point = (a: Vector, b: Vector): Vector => {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
};