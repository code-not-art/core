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
  options: { min?: number; max?: number } = {},
): number {
  const min = options.min === undefined ? 0 : options.min;
  const max = options.max === undefined ? 1 : options.max;
  return Math.max(min, Math.min(max, value));
}
