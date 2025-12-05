import { flipCoin, pickRandomly, roll, shuffle } from '@shared/util/random';

describe('Random utilities', () => {
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  test.each([
    [0, 1],
    [0.499999, 50],
    [0.5, 51],
    [0.99999999, 100],
  ])('roll() wih p = %d', (p, expected) => {
    jest.spyOn(global.Math, 'random').mockReturnValue(p);

    expect(roll(100)).toEqual(expected);
  });

  test.each([
    [0, false],
    [0.499999, false],
    [0.5, true],
    [0.99999999, true],
  ])('flipCoin() wih p = %d', (p, expected) => {
    jest.spyOn(global.Math, 'random').mockReturnValue(p);

    expect(flipCoin()).toEqual(expected);
  });

  describe('pickRandomly()', () => {
    const items = ['apple', 'banana', 'cherry', 'date'] as const;

    test.each([
      [0, 'apple'],
      [0.249999, 'apple'],
      [0.25, 'banana'],
      [0.499999, 'banana'],
      [0.5, 'cherry'],
      [0.749999, 'cherry'],
      [0.75, 'date'],
      [0.99999999, 'date'],
    ])('returns expected value when Math.random() = %d', (p, expected) => {
      jest.spyOn(global.Math, 'random').mockReturnValue(p);

      expect(pickRandomly([...items])).toEqual(expected);
    });

    test('throws for empty arrays', () => {
      expect(() => pickRandomly([])).toThrow(
        'Passed array must have at least 1 element',
      );
    });
  });

  describe('shuffle()', () => {
    test('shuffles array correctly', () => {
      const items = ['a', 'b', 'c', 'd', 'e'];
      const randomValues = [0.1, 0.6, 0.3, 0.8, 0.5];
      let callCount = 0;

      jest.spyOn(global.Math, 'random').mockImplementation(() => {
        const value = randomValues[callCount];
        if (value === undefined) {
          throw new Error('Insufficient mock random values provided');
        }
        callCount = (callCount + 1) % randomValues.length;
        return value;
      });

      const shuffled = shuffle(items);
      expect(shuffled).toEqual(['d', 'b', 'e', 'c', 'a']);
    });

    test('returns a new array instance', () => {
      const items = ['x', 'y', 'z'];
      jest.spyOn(global.Math, 'random').mockReturnValue(0);

      const shuffled = shuffle(items);
      expect(shuffled).not.toBe(items);
      expect(shuffled).toEqual(['y', 'z', 'x']);
      expect(items).toEqual(['x', 'y', 'z']);
    });

    test('returns empty array when input is empty', () => {
      const empty: string[] = [];

      const shuffled = shuffle(empty);
      expect(shuffled).toEqual([]);
      expect(shuffled).not.toBe(empty);
    });
  });
});
