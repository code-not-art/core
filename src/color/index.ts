import tinycolor from 'tinycolor2';

import { Random } from '../';
import { clamp } from '../utils';

class Color {
  seed;
  private _color;

  /**
   * Color
   * @param options
   */
  constructor(
    options?:
      | {
          h?: number;
          s?: number;
          v?: number;
          a?: number;
          seed?: string;
          rng?: Random;
        }
      | string,
  ) {
    if (options === undefined) {
      this.seed = new Random(`Random Color Seed`).next().toString();
      const _rng = new Random(`Color ${this.seed}`, this.seed);
      const hsv = `hsva(${_rng.float(0, 360)}, ${_rng.float(
        0,
        100,
      )}%, ${_rng.float(0, 100)}%, 1)`;
      this._color = tinycolor(hsv);
    } else if (typeof options === 'string') {
      this._color = tinycolor(options);
    } else {
      this.seed =
        options.seed || new Random(`Random Color Seed`).next().toString();
      const _rng = options.rng || new Random(`Color ${this.seed}`, this.seed);

      const _h = options.h || _rng.float(0, 360);
      const _s = options.s || _rng.float(0, 100);
      const _v = options.v || _rng.float(0, 100);
      const _a = options.a || 1;
      const hsv = `hsva(${_h}, ${_s}%, ${_v}%, ${_a})`;
      this._color = tinycolor(hsv);
    }
  }

  rgb() {
    return this._color.toRgbString();
  }

  get = { rgb: () => this._color.toRgb(), hsv: () => this._color.toHsv() };

  set = {
    rgb: (r: number, g: number, b: number) => {
      const rgba = this._color.toRgb();
      this._color = tinycolor({ a: rgba.a, r, g, b });
    },
    hsv: (h: number, s: number, v: number) => {
      const hsva = this._color.toHsv();
      this._color = tinycolor({ a: hsva.a, h, s, v });
    },

    alpha: (a: number) => {
      const rgba = this._color.toRgb();
      this._color = tinycolor({ ...rgba, a });
    },
    red: (r: number) => {
      const rgba = this._color.toRgb();
      this._color = tinycolor({ ...rgba, r });
    },
    green: (g: number) => {
      const rgba = this._color.toRgb();
      this._color = tinycolor({ ...rgba, g });
    },
    blue: (b: number) => {
      const rgba = this._color.toRgb();
      this._color = tinycolor({ ...rgba, b });
    },
    hue: (h: number) => {
      const hsva = this._color.toHsv();
      this._color = tinycolor({ ...hsva, h });
    },
    saturation: (s: number) => {
      const hsva = this._color.toHsv();
      this._color = tinycolor({ ...hsva, s });
    },
    value: (v: number) => {
      const hsva = this._color.toHsv();
      this._color = tinycolor({ ...hsva, v });
    },
  };

  color() {
    return tinycolor(this._color.toRgb());
  }

  static mix(c1: Color, c2: Color, ratio: number = 0.5): Color {
    const clampedRatio = clamp(ratio);

    const hsva1 = c1.get.hsv();
    const hsva2 = c2.get.hsv();

    const h = hsva1.h * ratio + hsva2.h * (1 - clampedRatio);
    const s = hsva1.s * ratio + hsva2.s * (1 - clampedRatio);
    const v = hsva1.v * ratio + hsva2.v * (1 - clampedRatio);
    const a = hsva1.a * ratio + hsva2.a * (1 - clampedRatio);

    return new Color({ h, s, v, a });
  }
}

export default Color;
