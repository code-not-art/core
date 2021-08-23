import { TAU } from './constants';

export function clamp(
  value: number,
  options: { min: number; max: number } = { min: 0, max: 1 },
) {
  return Math.max(options.min, Math.min(options.max, value));
}

// Arrays and Iteration
export function array(length: number) {
  return Array.from({ length: length }, (_v, k) => k);
}
export function range(start: number, end: number) {
  return array(end - start).map((i) => i + start);
}
export function sequence<T>(count: number, method: (i: number) => T): T[] {
  return array(count).map((i) => method(i));
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
