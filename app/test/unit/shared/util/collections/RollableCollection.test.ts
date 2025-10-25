import { RollableCollection } from '@shared/util/collections/RollableCollection';

describe('RollableCollection', () => {
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  describe('getRandom', () => {
    it.each([
      ['a', 0],
      ['b', 0.49],
      ['c', 0.5],
      ['d', 0.99],
    ])('returns %s for p=%d ', (expected, p) => {
      jest.spyOn(global.Math, 'random').mockReturnValue(p);

      const collection = new RollableCollection(['a', 'b', 'c', 'd']);
      expect(collection.getRandom()).toBe(expected);
    });

    it('reflects array mutations before selecting an element', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
      const collection = new RollableCollection<number>([1, 2]);
      collection.shift();
      expect(collection.getRandom()).toBe(2);

      collection.unshift(6);
      expect(collection.getRandom()).toBe(6);
    });

    it('uses the current length after removing items', () => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0.99);
      const collection = new RollableCollection<number>([4, 5, 6, 7]);
      collection.pop();

      expect(collection.getRandom()).toBe(6);
    });
  });
});
