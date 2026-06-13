import { SUN_MASS } from '../../../../../src/domain/starsystem/domain/valueObjects/Mass';
import {
  InvalidRollBetweenInputError,
  rollBetween,
  rollStarMassBetween,
} from '../../../../../src/domain/starsystem/util/rollBetween';

describe('rollBetween', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses logarithmic distribution by default for numbers', () => {
    mockRandomSequence([0.5]);

    expect(rollBetween(1, 100)).toBeCloseTo(10, 12);
  });

  it('supports logarithmic distribution explicitly for numbers', () => {
    mockRandomSequence([0.5]);

    expect(rollBetween(1, 100, { strategy: 'log' })).toBeCloseTo(10, 12);
  });

  it('supports power-law distribution for numbers', () => {
    mockRandomSequence([0.5]);

    expect(
      rollBetween(1, 101, { strategy: 'power-law', exponent: 2 }),
    ).toBeCloseTo(26, 12);
  });

  it('supports power-law distribution for bigints', () => {
    mockRandomSequence([0.5]);

    expect(
      rollBetween(1n, 101n, { strategy: 'power-law', exponent: 2 }),
    ).toBe(26n);
  });

  it('throws a domain error for invalid numeric ranges and exponents', () => {
    expect(() => rollBetween(0, 10)).toThrow(InvalidRollBetweenInputError);
    expect(() => rollBetween(1, 1)).toThrow(InvalidRollBetweenInputError);
    expect(() => rollBetween(1, Infinity)).toThrow(InvalidRollBetweenInputError);
    expect(() => rollBetween(Number.NaN, 10)).toThrow(InvalidRollBetweenInputError);
    expect(() =>
      rollBetween(1, 10, { strategy: 'power-law', exponent: 0 }),
    ).toThrow(InvalidRollBetweenInputError);
  });

  it('throws a domain error when bigint range cannot be converted to a finite number', () => {
    expect(() => rollBetween(1n, 10n ** 400n)).toThrow(
      InvalidRollBetweenInputError,
    );
  });
});

describe('rollStarMassBetween', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a value within range for numbers', () => {
    mockRandomSequence([0.1, 0.4]);

    const value = rollStarMassBetween(0.01, 300);

    expect(value).toBeGreaterThanOrEqual(0.01);
    expect(value).toBeLessThanOrEqual(300);
  });

  it('uses the expected inverse-cdf path for a single IMF segment', () => {
    mockRandomSequence([0.2, 0.5]);

    const expected = samplePowerLawSegment(0.5, 50, 2.3, 0.5);

    expect(rollStarMassBetween(0.5, 50)).toBeCloseTo(expected, 12);
  });

  it('prefers lower masses over higher masses for a wide range', () => {
    mockRandomSequence([0.01, 0.5, 0.1, 0.5, 0.3, 0.5, 0.95, 0.5]);

    const results = [
      rollStarMassBetween(0.01, 300),
      rollStarMassBetween(0.01, 300),
      rollStarMassBetween(0.01, 300),
      rollStarMassBetween(0.01, 300),
    ];

    const lowMassCount = results.filter((value) => value < 0.5).length;
    const highMassCount = results.filter((value) => value >= 0.5).length;

    expect(lowMassCount).toBeGreaterThan(highMassCount);
  });

  it('interprets bigint inputs as kilograms', () => {
    mockRandomSequence([0.2, 0.5]);
    const numberResult = rollStarMassBetween(1, 50);

    mockRandomSequence([0.2, 0.5]);
    const bigintResult = rollStarMassBetween(SUN_MASS, 50n * SUN_MASS);

    expect(bigintResult).toBeGreaterThanOrEqual(SUN_MASS);
    expect(bigintResult).toBeLessThanOrEqual(50n * SUN_MASS);
    expect(Number(bigintResult) / Number(SUN_MASS)).toBeCloseTo(numberResult, 6);
  });
});

function mockRandomSequence(values: readonly number[]): jest.SpiedFunction<typeof Math.random> {
  let index = 0;

  return jest.spyOn(Math, 'random').mockImplementation(() => {
    const nextValue = values[index] ?? values[values.length - 1];
    index += 1;

    return nextValue ?? 0;
  });
}

function samplePowerLawSegment(
  minimum: number,
  maximum: number,
  alpha: number,
  unitRandom: number,
): number {
  if (alpha === 1) {
    return minimum * Math.pow(maximum / minimum, unitRandom);
  }

  const exponent = 1 - alpha;
  const minimumTerm = Math.pow(minimum, exponent);
  const maximumTerm = Math.pow(maximum, exponent);

  return Math.pow(
    minimumTerm + unitRandom * (maximumTerm - minimumTerm),
    1 / exponent,
  );
}
