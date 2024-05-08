import { roll } from './random';

export class RollableCollection<T> {
  public constructor(private store: T[]) {}

  public getRandom(): T {
    const position = roll(this.store.length) - 1;

    return this.store[position]!;
  }
}
