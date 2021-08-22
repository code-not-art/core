import { TAU } from './constants';

// Arrays and Iteration
export function array(length: number) {
  return Array.from({ length: length }, (_v, k) => k);
}
export function range(start: number, end: number) {
  return array(end - start).map((i) => i + start);
}
export function repeat(count: number, action: (index: number) => void): void {
  for (let i = 0; i <= count; i++) {
    action(i);
  }
}

// Degree and Radian conversion
export function toDegrees(rads: number): number {
  return (rads / TAU) * 360;
}

export function toRadians(degrees: number): number {
  return (degrees / 360) * TAU;
}
