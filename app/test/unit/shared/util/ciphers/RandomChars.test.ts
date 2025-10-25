import type { Charsets } from '@shared/util/ciphers/RandomChars';
import { RandomChars } from '@shared/util/ciphers/RandomChars';

describe('RandomChars.generate', () => {
  let randomSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    randomSpy = jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    randomSpy.mockRestore();
  });

  it.each<[keyof Charsets, number[], string]>([
    ['alpha', [0, 0.5, 0.99], 'aAZ'],
    ['alphaNum', [0, 0.5, 0.99], '0Vz'],
    ['upperNum', [0, 0.25, 0.75], '09R'],
    ['num', [0, 0.123, 0.987], '019'],
  ])(
    'generates deterministic string for %s charset',
    (charset, values, expected) => {
      values.forEach((value) => randomSpy.mockReturnValueOnce(value));

      expect(RandomChars.generate(charset, values.length)).toBe(expected);
    },
  );

  it('returns empty string for zero length', () => {
    expect(RandomChars.generate('num', 0)).toBe('');
  });
});
