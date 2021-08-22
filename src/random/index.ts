import srng from 'seed-random';
import { array, repeat } from '../utils';

type Context = {
  context: string;
  count: number;
  seed: string;
  rng: () => number;
};

function Random(context: string, seed?: string) {
  const _contexts: Context[] = [createContext(context, seed)];

  function createContext(context: string, seed?: string) {
    const _seed = `${seed || Math.random()}`;
    return { context, count: 0, seed: _seed, rng: srng(_seed) };
  }

  /* ***
   * Context Management
   *** */

  // Get Data about current active context
  function getContext(): Context {
    return _contexts[_contexts.length - 1];
  }
  function getCount(): number {
    return getContext().count;
  }
  function getSeed(): string {
    return getContext().seed;
  }

  function getContextByLabel(context: string): Context | undefined {
    return _contexts.find((i) => i.context === context);
  }
  function getCountByLabel(context: string) {
    return getContextByLabel(context)?.count;
  }
  function getSeedByLabel(context: string) {
    return getContextByLabel(context)?.seed;
  }
  function getContexts() {
    return _contexts;
  }

  function push(context: string, seed?: string) {
    _contexts.push(createContext(context, seed));
  }

  function pop() {
    _contexts.pop();
  }

  /* ***
   * Do Random Stuff
   *** */

  function next(): number {
    const _context = getContext();
    _context.count++;
    return _context.rng();
  }

  function bool(chance: number = 0.5): boolean {
    return next() <= chance;
  }

  function int(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1) + min);
  }

  function float(min: number, max: number): number {
    return next() * (max - min + 1) + min;
  }

  function fuzzy(base: number) {
    return {
      int: (range: number): number => Math.round(int(-range, range) + base),
      float: (range: number): number => float(-range, range) + base,
    };
  }

  function chooseOne<T>(items: T[]): T {
    return items[int(0, items.length - 1)];
  }

  function choose<T>(
    items: T[],
    count: number,
    allowDuplicates: boolean = true,
  ): T[] {
    const output: T[] = [];
    if (allowDuplicates) {
      repeat(count, () => {
        output.push(chooseOne(items));
      });
    } else {
      // No Duplicates version
      const _count = count > items.length ? items.length : count;
      let options = array(_count);
      repeat(_count, () => {
        const selection = int(0, options.length);
        output.push(items[selection]);
        // Remove selection from options list
        options = options
          .slice(0, selection)
          .concat(options.splice(selection + 1));
      });
    }
    return output;
  }

  function shuffle<T>(items: T[]): T[] {
    const output = items.map((i) => i);
    repeat(output.length, (i) => {
      const swap = int(i, output.length - 1);
      const temp = output[i];
      output[i] = output[swap];
      output[swap] = temp;
    });
    return output;
  }

  return {
    getContext,
    getCount,
    getSeed,
    getContextByLabel,
    getCountByLabel,
    getSeedByLabel,
    getContexts,
    push,
    pop,

    next,
    bool,
    int,
    float,
    fuzzy,

    shuffle,

    choose,
    chooseOne,
  };
}

export default Random;
