import { roll } from '@forsetius/glitnir-shared';

/**
 * Array with helper to pick a random element.
 */
export class RollableCollection<T> {
  private readonly store: [T, number][];
  private readonly max: number;

  public constructor(items: readonly [T, number][]);
  public constructor(items: readonly T[]);
  public constructor(items: readonly T[] | readonly [T, number][] = []) {
    if (items.length === 0) {
      throw new Error('Cannot create empty collection');
    }

    if (Array.isArray(items[0])) {
      let cumulativeWeight = 0;
      this.store = (items as [T, number][]).map(([item, weight]) => {
        cumulativeWeight += weight;
        return [item, cumulativeWeight];
      });
      this.max = cumulativeWeight;
    } else {
      this.store = (items as T[]).map((item, index) => [item, index + 1]);
      this.max = items.length;
    }
  }

  public getRandom(): T {
    const position = roll(this.max);
    const entry = this.store.find(([, weight]) => weight >= position);

    return entry![0];
  }
}
