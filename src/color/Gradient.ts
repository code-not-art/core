import { clamp, repeat } from '../utils';
import Color from './';

/**
 * Create a gradient object out of any number of colors.
 * The colors will be divided in positions from 0 to 1, and then when a color is requested
 * from the gradient at a specific position, the color returned will be a mix of the gradient
 * colors at a ratio based on the relative position to those colors.
 * @param {...Color}
 */
class Gradient {
  colors: Map<number, Color>;
  private cache: Map<number, Color>;

  constructor(...colors: Color[]) {
    this.colors = new Map<number, Color>();
    this.cache = new Map<number, Color>();

    const divisions = colors.length - 1;
    colors.forEach((color, index) => {
      const position = index / divisions;
      this.colors.set(position, color);
    });
  }

  private clearCache() {
    this.cache = new Map<number, Color>();
  }

  /**
   * Retrieve the color from the gradient from the provided position.
   * @param position {number} from 0 to 1. Numbers outside this range will be clamped to 0 or 1 and return the color at that end of the gradient
   * @returns {Color}
   */
  at(position: number): Color {
    const clampedPosition = clamp(position);
    switch (this.colors.size) {
      case 0:
        return new Color({ h: 0, s: 0, v: 0, a: 1 });
      case 1:
        return this.colors.entries().next().value;
      default:
        // const values = this.colors.values();
        if (this.cache.has(clampedPosition)) {
          return <Color>this.cache.get(clampedPosition);
        }

        if (this.colors.has(clampedPosition)) {
          const output = <Color>this.colors.get(clampedPosition);
          this.cache.set(clampedPosition, output);
          return output;
        }

        // No exact match found, need to calculate a mix from the boundary colours
        const values = Array.from(this.colors.keys()).sort();

        const upperBound = values.find((i) => i > clampedPosition);
        if (upperBound === undefined || !this.colors.has(upperBound)) {
          console.error(
            `[@code-not-art/core.Gradient.at] Impossible situation! Shouldn't be here in normal operation. Returning the last color in gradient.`,
          );
          const selection = Math.max(...values);
          return <Color>this.colors.get(selection);
        }
        const lowerBoundIndex = values.indexOf(upperBound) - 1;
        if (lowerBoundIndex < 0 || lowerBoundIndex >= values.length) {
          console.error(
            `[@code-not-art/core.Gradient.at] Impossible situation! Shouldn't be here in normal operation. Lower bound index out of range. Returning the color identified as upper bound for this position.`,
          );
          return <Color>this.colors.get(upperBound);
        }
        const lowerBound = values[lowerBoundIndex];
        if (!this.colors.has(lowerBound)) {
          console.error(
            `[@code-not-art/core.Gradient.at] Impossible situation! Shouldn't be here in normal operation. lowerBound value not found in color map. Returning the color identified as upper bound for this position.`,
          );
          return <Color>this.colors.get(upperBound);
        }
        const ratio =
          (clampedPosition - lowerBound) / (upperBound - lowerBound);
        const upperColor = <Color>this.colors.get(upperBound);
        const lowerColor = <Color>this.colors.get(lowerBound);

        const output = Color.mix(upperColor, lowerColor, ratio);
        this.cache.set(clampedPosition, output);
        return output;
    }
  }

  list(length: number): Color[] {
    const output: Color[] = [];
    repeat(length, (i) => {
      output[i] = this.at(i / (length - 1));
    });

    return output;
  }

  /**
   * Add a color to the gradient at the provided position (0 to 1).
   * No adjustments will be made to the existing colors in the gradient.
   * This can be used this to replace an existing color by providing an already used position.
   * @param position {number}
   * @param color {Color}
   */
  set(position: number, color: Color): void {
    const clampedPosition = clamp(position);
    this.colors.set(clampedPosition, color);
    this.clearCache();
  }

  /**
   * Add a new color to the gradient at the end of the gradient (position = 1)
   * The existing colours will stay in the same proportion but will be repositioned
   * to take up a portion of the gradient that leaves an equal (by number of colors)
   * region for the new color being added.
   * @param color {Color}
   */
  add(color: Color): void {
    const values = Array.from(this.colors.keys()).sort();

    // The original gradient will be restricted to a range of positions based on the number of colours in the gradient,
    // with the new colour getting an equal division of space at the end of the gradient.
    const newDivisions = values.length;
    const valuesRange = newDivisions - 1 / newDivisions;

    // Add the existing gradient to the new color map at proportional positions within the new valuesRange
    const newColors = new Map<number, Color>();
    values.forEach((originalValue) => {
      const newValue = valuesRange * originalValue;
      const color = <Color>this.colors.get(originalValue);

      newColors.set(newValue, color);
    });
    // add the new color at the end
    newColors.set(1, color);

    // clear cache and replace existing gradient map with the new one
    this.clearCache();
    this.colors = newColors;
  }

  /**
   * Remove color at the specific position.
   * Note: if you need to find the position of a specific Color, take a look inside the gradient.colors Map
   * and find the entry you want to remove, then pass the key from that entry to this method.
   * @param position
   */
  remove(position: number) {
    // TODO: Handle case where color at 0 or 1 is removed, need to rescale the whole gradient.
    if (this.colors.has(position)) {
      this.colors.delete(position);
      this.clearCache();
    } else {
      console.warn(
        `[@code-not-art/core.Gradient.remove] No Color at the provided position to remove.`,
      );
    }
  }

  /**
   * Returns a new gradient built from this gradient that repeats all the colours in the gradient to form a loop.
   * The end color is moved to the midway position, then all the other colors are added in reverse order from 0.5 to 1
   * This does not modify the current gradient, so it can be used like gradient.loop().at(0.7);
   * or to retrieve `const loopGrad = gradient.loop();`
   * returns {Gradient}
   */
  loop(): Gradient {
    const loopGradient = new Gradient();
    this.colors.forEach((entry, key) => {
      const firstPosition = key / 2;
      const secondPosition = 1 - firstPosition;
      loopGradient.set(firstPosition, entry);
      loopGradient.set(secondPosition, entry);
    });

    return loopGradient;
  }
}

export default Gradient;
