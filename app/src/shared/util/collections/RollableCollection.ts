import { roll } from '../random';

/**
 * Array with helper to pick a random element.
 */
export class RollableCollection<T> extends Array<T> {
  public constructor(items: readonly T[] = []) {
    super(...items);
  }

  public getRandom(): T {
    const position = roll(this.length) - 1;

    return this[position]!;
  }
}
