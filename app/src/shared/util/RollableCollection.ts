import { roll } from './random';

export class RollableCollection<T extends { chance?: number }> {
  private readonly store: (T & { chance: number })[];
  private totalChance = 0;

  public constructor(store: T[]) {
    this.store = store.map((item) => {
      const chance = item.chance ?? 1;
      this.totalChance += chance;

      return {
        ...item,
        chance,
      };
    });
  }

  public getRandom(modifier = 0, minimum = 0): T {
    let targetNumber = roll(this.totalChance) - 1 + modifier;
    if (targetNumber < minimum) {
      targetNumber = minimum;
    }
    const maxIndex = this.store.length - 1;

    let index = -1;
    let runningTotal = 0;
    do {
      index++;
      runningTotal += this.store[index]!.chance;
    } while (index < maxIndex && runningTotal < targetNumber);

    return this.store[index]!;
  }
}
