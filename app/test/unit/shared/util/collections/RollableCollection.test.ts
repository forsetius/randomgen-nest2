import { roll } from '@forsetius/glitnir-shared';
import { RollableCollection } from '../../../../../src/shared/util/collections/RollableCollection';

jest.mock('@forsetius/glitnir-shared', () => ({
  roll: jest.fn(),
}));

const rollMock = jest.mocked(roll);

describe('RollableCollection', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getRandom', () => {
    it.each([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ])('returns %s for roll=%d ', (expected, rollResult) => {
      rollMock.mockReturnValue(rollResult);

      const collection = new RollableCollection(['a', 'b', 'c', 'd']);
      expect(collection.getRandom()).toBe(expected);
      expect(rollMock).toHaveBeenCalledWith(4);
    });

    it('reflects array mutations before selecting an element', () => {
      rollMock.mockReturnValue(1);
      const collection = new RollableCollection<number>([1, 2]);
      collection.shift();
      expect(collection.getRandom()).toBe(2);
      expect(rollMock).toHaveBeenLastCalledWith(1);

      collection.unshift(6);
      expect(collection.getRandom()).toBe(6);
      expect(rollMock).toHaveBeenLastCalledWith(2);
    });

    it('uses the current length after removing items', () => {
      rollMock.mockReturnValue(3);
      const collection = new RollableCollection<number>([4, 5, 6, 7]);
      collection.pop();

      expect(collection.getRandom()).toBe(6);
      expect(rollMock).toHaveBeenCalledWith(3);
    });
  });
});
