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

  describe('constructor', () => {
    it('infers item type from weighted tuples', () => {
      rollMock.mockReturnValue(1);
      const weightedItems: [{value: string}, number][] = [
        [{value: 'alpha'}, 1],
      ];
      const collection: RollableCollection<{value: string}> =
        new RollableCollection(weightedItems);

      expect(collection.getRandom()).toEqual({value: 'alpha'});
    });

    it('rejects empty collections', () => {
      expect(() => new RollableCollection([])).toThrow(
        'Cannot create empty collection',
      );
    });
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

    it.each([
      ['a', 1],
      ['a', 2],
      ['b', 3],
      ['b', 7],
    ])(
      'returns %s for weighted tuples when roll=%d',
      (expected, rollResult) => {
        rollMock.mockReturnValue(rollResult);
        const collection = new RollableCollection([
          ['a', 2],
          ['b', 5],
        ]);

        expect(collection.getRandom()).toBe(expected);
        expect(rollMock).toHaveBeenCalledWith(7);
      },
    );

    it('returns the only plain item', () => {
      rollMock.mockReturnValue(1);
      const collection = new RollableCollection<number>([4]);

      expect(collection.getRandom()).toBe(4);
      expect(rollMock).toHaveBeenCalledWith(1);
    });
  });
});
