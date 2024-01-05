import Color from './Color.js';
import { clamp } from '../utils/index.js';

/**
 * Mix two colors together in any ratio
 * @param c1 color 1
 * @param c2 color 2
 * @param ratio from 0 (all color 2) to 1 (all color 1). Default is 0.5 which is an even mix (midpoint) between both colors.
 * @returns Color
 */
export function mix(c1: Color, c2: Color, ratio: number = 0.5): Color {
  const clampedRatio = clamp(ratio);

  const hsva1 = c1.get.hsv();
  const hsva2 = c2.get.hsv();

  const h = hsva1.h * ratio + hsva2.h * (1 - clampedRatio);
  const s = hsva1.s * ratio + hsva2.s * (1 - clampedRatio);
  const v = hsva1.v * ratio + hsva2.v * (1 - clampedRatio);
  const a = hsva1.a * ratio + hsva2.a * (1 - clampedRatio);

  return new Color({ h, s, v, a });
}
