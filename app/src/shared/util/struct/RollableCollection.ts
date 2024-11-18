import { roll } from '../random';

export class RollableCollection<T> {
  private readonly store: RollableCollectionRecord<T>[];
  private totalChance = 0;

  public constructor(store: RollableCollectionRecord<T>[] | T[]) {
    this.store = store.map((record) => {
      const element =
        typeof record === 'object' && record !== null && 'chance' in record
          ? record
          : { chance: 1, item: record };
      this.totalChance += element.chance;

      return element;
    });
  }

  public getRandom(modifier = 0, minimum = 0): T {
    const targetNumber =
      roll(this.totalChance - minimum) + minimum - 1 + modifier;
    const maxIndex = this.store.length - 1;

    let index = -1;
    let runningTotal = 0;
    do {
      index++;
      runningTotal += this.store[index]!.chance;
    } while (index < maxIndex && runningTotal < targetNumber);

    return this.store[index]!.item;
  }
}

type RollableCollectionRecord<T> = { chance: number; item: T };
