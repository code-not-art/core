import srng from 'seed-random';
import { TAU } from '../constants';
import { array, repeat } from '../utils';
import * as Words from './words';

type Context = {
  context: string;
  count: number;
  seed: string;
  rng: () => number;
};

class Random {
  _contexts: Context[] = [];
  constructor(context: string, seed?: string) {
    this._contexts.push(this.createContext(context, seed));
  }

  createContext(context: string, seed?: string) {
    const _seed = `${seed ? seed : Math.random()}`;
    return { context, count: 0, seed: _seed, rng: srng(_seed) };
  }

  /* ***
   * Context Management
   *** */

  // Get Data about current active context
  getContext(): Context {
    return this._contexts[this._contexts.length - 1];
  }
  getCount(): number {
    return this.getContext().count;
  }
  getSeed(): string {
    return this.getContext().seed;
  }

  getContextByLabel(context: string): Context | undefined {
    return this._contexts.find((i) => i.context === context);
  }
  getCountByLabel(context: string) {
    return this.getContextByLabel(context)?.count;
  }
  getSeedByLabel(context: string) {
    return this.getContextByLabel(context)?.seed;
  }
  getContexts() {
    return this._contexts;
  }

  push(context: string, seed?: string) {
    const _seed = seed === undefined ? this.next().toString() : seed;
    this._contexts.push(this.createContext(context, _seed));
  }

  pop() {
    this._contexts.pop();
  }

  reset() {
    const context = this.getContext();
    context.rng = srng(context.seed);
  }

  /* ***
   * Do Random Stuff
   *** */

  next(): number {
    const _context = this.getContext();
    _context.count++;
    return _context.rng();
  }

  bool(chance: number = 0.5): boolean {
    return this.next() <= chance;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1) + min);
  }

  float(min: number, max: number): number {
    return this.next() * (max - min + 1) + min;
  }

  angle(): number {
    return this.next() * TAU;
  }

  word(type?: 'noun' | 'adjective' | 'adverb') {
    switch (type) {
      case 'noun':
        return Words.getNoun(this.next());
      case 'adjective':
        return Words.getAdjective(this.next());
      case 'adverb':
        return Words.getAdverb(this.next());
      default:
        return Words.getWord(this.next());
        break;
    }
  }

  fuzzy(base: number) {
    return {
      int: (range: number): number =>
        range === 0
          ? this.next() * 0 + base
          : Math.round(this.int(-range, range) + base),
      float: (range: number): number =>
        range === 0 ? this.next() * 0 + base : this.float(-range, range) + base,
    };
  }

  chooseOne<T>(items: T[]): T {
    return items[this.int(0, items.length - 1)];
  }

  choose<T>(items: T[], count: number, allowDuplicates: boolean = true): T[] {
    const output: T[] = [];
    if (allowDuplicates) {
      repeat(count, () => {
        output.push(this.chooseOne(items));
      });
    } else {
      // No Duplicates version
      const _count = count > items.length ? items.length : count;
      let options = array(_count);
      repeat(_count, () => {
        const selection = this.int(0, options.length);
        output.push(items[selection]);
        // Remove selection from options list
        options = options
          .slice(0, selection)
          .concat(options.splice(selection + 1));
      });
    }
    return output;
  }

  shuffle<T>(items: T[]): T[] {
    const output = items.map((i) => i);
    repeat(output.length, (i) => {
      const swap = this.int(i, output.length - 1);
      const temp = output[i];
      output[i] = output[swap];
      output[swap] = temp;
    });
    return output;
  }
}

export default Random;
