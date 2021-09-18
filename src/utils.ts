import { TAU } from './constants';

/**
 * Restricts a value to within a defined range (default is 0 to 1).
 * If the input number is outside this range, then the min or max value of that
 * range wil be returned in its place. If the input number is within the range,
 * the original value will be returned.
 * @param value {number}
 * @param options {Object}
 * @returns {number}
 */
export function clamp(
  value: number,
  options: { min: number; max: number } = { min: 0, max: 1 },
): number {
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
  for (let i = 0; i < count; i++) {
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
