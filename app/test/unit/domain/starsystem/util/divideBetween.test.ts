import {
  divideBetween,
  DivideBetweenImpossibleError,
} from '../../../../../src/domain/starsystem/util/divideBetween';

describe('divideBetween', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns distinct number parts that stay within the dividend budget', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.25);

    const parts = divideBetween(11.3, 3, 0.01);

    expect(parts).toHaveLength(3);
    expect(parts.every((part) => part >= 0.01)).toBe(true);
    expect(new Set(parts).size).toBe(parts.length);
    expect(parts.reduce((sum, part) => sum + part, 0)).toBeLessThanOrEqual(11.3);
  });

  it('returns strictly positive number parts when minimum is omitted', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const parts = divideBetween(9, 3);

    expect(parts).toHaveLength(3);
    parts.forEach((part) => {
      expect(part).toBeGreaterThan(0);
    });
    expect(new Set(parts).size).toBe(parts.length);
    expect(parts.reduce((sum, part) => sum + part, 0)).toBeLessThanOrEqual(9);
  });

  it('returns distinct bigint parts that respect the minimum', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.25);

    const parts = divideBetween(90n, 3, 10n);

    expect(parts).toHaveLength(3);
    expect(parts.every((part) => part >= 10n)).toBe(true);
    expect(parts.every((part) => typeof part === 'bigint')).toBe(true);
    expect(new Set(parts).size).toBe(parts.length);
    expect(parts.reduce((sum, part) => sum + part, 0n)).toBeLessThanOrEqual(90n);
  });

  it('returns the whole dividend when only one part is requested', () => {
    const parts = divideBetween(7n, 1, 3n);

    expect(parts).toEqual([7n]);
  });

  it('throws a domain error when the parts cannot be split into distinct values', () => {
    expect(() => divideBetween(10, 2, 5)).toThrow(DivideBetweenImpossibleError);
    expect(() => divideBetween(15n, 3, 5n)).toThrow(DivideBetweenImpossibleError);
  });
});
