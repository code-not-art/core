import { Random } from '../';
import tinycolor from 'tinycolor2';

export default class Color {
  seed;
  color;

  constructor(options: {
    css?: string;
    h?: number;
    s?: number;
    v?: number;
    a?: number;
    seed?: string;
    rng?: Random;
  }) {
    if (options.css) {
      this.color = tinycolor(options.css);
    } else {
      this.seed =
        options.seed || new Random(`Random Color Seed`).next().toString();
      const _rng = options.rng || new Random(`Color ${this.seed}`, this.seed);

      const _h = options.h || _rng.float(0, 360);
      const _s = options.s || _rng.float(0, 100);
      const _v = options.v || _rng.float(0, 100);
      const _a = options.a || 1;
      const hsv = `hsv(${_h}, ${_s}%, ${_v}%, ${_a})`;
      this.color = tinycolor(hsv);
    }
  }

  get = { rgb: () => this.color.toRgb(), hsv: () => this.color.toHsv() };

  set = {
    rgb: (r: number, g: number, b: number) => {
      const rgba = this.color.toRgb();
      this.color = tinycolor({ a: rgba.a, r, g, b });
    },
    hsv: (h: number, s: number, v: number) => {
      const hsva = this.color.toHsv();
      this.color = tinycolor({ a: hsva.a, h, s, v });
    },

    alpha: (a: number) => {
      const rgba = this.color.toRgb();
      this.color = tinycolor({ ...rgba, a });
    },
    red: (r: number) => {
      const rgba = this.color.toRgb();
      this.color = tinycolor({ ...rgba, r });
    },
    green: (g: number) => {
      const rgba = this.color.toRgb();
      this.color = tinycolor({ ...rgba, g });
    },
    blue: (b: number) => {
      const rgba = this.color.toRgb();
      this.color = tinycolor({ ...rgba, b });
    },
    hue: (h: number) => {
      const hsva = this.color.toHsv();
      this.color = tinycolor({ ...hsva, h });
    },
    saturation: (s: number) => {
      const hsva = this.color.toHsv();
      this.color = tinycolor({ ...hsva, s });
    },
    value: (v: number) => {
      const hsva = this.color.toHsv();
      this.color = tinycolor({ ...hsva, v });
    },
  };
}
