import Distribution from './Distribution.js';

export type RandomContext = {
  context: string;
  count: number;
  seed: string;
  distribution: Distribution;
  rng: () => number;
};
