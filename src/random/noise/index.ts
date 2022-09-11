import * as openSimplex from 'open-simplex-noise';

export type Noise2D = (x: number, y: number) => number;
export type Noise3D = (x: number, y: number, z: number) => number;
export type Noise4D = (x: number, y: number, z: number, w: number) => number;

export type WrapOptions = {
  x?: boolean;
  y?: boolean;
  z?: boolean;
  w?: boolean;
};
export type NoiseOptions = {
  amplitude?: number;
  frequency?: number;
  octaves?: number[];
  wrap?: WrapOptions;
};

const defaultOptions = {
  amplitude: 1,
  frequency: 1,
  octaves: [1],
  wrap: {},
};

export const simplex2 = (
  integerSeed: number,
  options: NoiseOptions = {},
): Noise2D => {
  const { amplitude, frequency, octaves } = {
    ...defaultOptions,
    ...options,
  };
  const noise = openSimplex.makeNoise2D(integerSeed);
  return (x: number, y: number): number => {
    const output =
      octaves
        .map((octave) => {
          const freq = frequency * Math.pow(2, octave);
          return noise(x * freq, y * freq);
        })
        .reduce((acc, value) => acc + value, 0) *
      (amplitude / octaves.length);
    return output;
  };
};
export const simplex3 = (
  integerSeed: number,
  options: NoiseOptions = {},
): Noise3D => {
  const { amplitude, frequency, octaves } = {
    ...defaultOptions,
    ...options,
  };
  const noise = openSimplex.makeNoise3D(integerSeed);
  return (x: number, y: number, z: number): number => {
    const output =
      octaves
        .map((octave) => {
          const freq = frequency * Math.pow(2, octave);
          return noise(x * freq, y * freq, z * freq);
        })
        .reduce((acc, value) => acc + value, 0) *
      (amplitude / octaves.length);
    return output;
  };
};
export const simplex4 = (
  integerSeed: number,
  options: NoiseOptions = {},
): Noise4D => {
  const { amplitude, frequency, octaves } = {
    ...defaultOptions,
    ...options,
  };
  const noise = openSimplex.makeNoise4D(integerSeed);
  return (x: number, y: number, z: number, w: number): number => {
    const output =
      octaves
        .map((octave) => {
          const freq = frequency * Math.pow(2, octave);
          return noise(x * freq, y * freq, z * freq, w * freq);
        })
        .reduce((acc, value) => acc + value, 0) *
      (amplitude / octaves.length);
    return output;
  };
};
