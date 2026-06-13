import { SUN_MASS } from '../domain/valueObjects/Mass';

const DEFAULT_POWER_LAW_EXPONENT = 2;
const MINIMUM_IMF_SOLAR_MASS = 0.01;
const SOLAR_MASS_IN_KILOGRAMS = Number(SUN_MASS);

interface ImfSegmentDefinition {
  readonly minimumSolarMass: number;
  readonly maximumSolarMass: number;
  readonly alpha: number;
}

interface ImfSegment extends ImfSegmentDefinition {
  readonly weight: number;
}

const IMF_SEGMENT_DEFINITIONS: readonly ImfSegmentDefinition[] = [
  { minimumSolarMass: 0.01, maximumSolarMass: 0.08, alpha: 0.3 },
  { minimumSolarMass: 0.08, maximumSolarMass: 0.5, alpha: 1.3 },
  {
    minimumSolarMass: 0.5,
    maximumSolarMass: Number.POSITIVE_INFINITY,
    alpha: 2.3,
  },
];

export type RollBetweenOptions =
  | { strategy?: 'log' }
  | { strategy: 'power-law'; exponent?: number };

export class InvalidRollBetweenInputError<
  T extends number | bigint,
> extends Error {
  public constructor(
    public readonly minimum: T,
    public readonly maximum: T,
    public readonly options?: RollBetweenOptions,
    message?: string,
  ) {
    super(
      message ??
        `Cannot roll between ${String(minimum)} and ${String(maximum)}`,
    );

    this.name = 'InvalidRollBetweenInputError';
  }
}

export function rollBetween<T extends number | bigint>(
  minimum: T,
  maximum: T,
  options: RollBetweenOptions = {},
): T {
  if (typeof minimum === 'number' && typeof maximum === 'number') {
    validateNumberRange(minimum, maximum, options);
    const result = rollNumberBetween(minimum, maximum, options);

    return result as T;
  }

  if (typeof minimum === 'bigint' && typeof maximum === 'bigint') {
    validateBigIntRange(minimum, maximum, options);
    const result = rollBigIntBetween(minimum, maximum, options);

    return result as T;
  }

  throw new InvalidRollBetweenInputError(
    minimum,
    maximum,
    options,
    'Cannot roll between values of different numeric types',
  );
}

export function rollStarMassBetween<T extends number | bigint>(
  minimum: T,
  maximum: T,
): T {
  if (typeof minimum === 'number' && typeof maximum === 'number') {
    validateNumberRange(minimum, maximum);
    validateImfRange(minimum, maximum);

    return rollStarMassBetweenNumbers(minimum, maximum) as T;
  }

  if (typeof minimum === 'bigint' && typeof maximum === 'bigint') {
    validateBigIntRange(minimum, maximum);

    const minimumSolarMass = convertBigIntToFiniteNumber(minimum) / SOLAR_MASS_IN_KILOGRAMS;
    const maximumSolarMass = convertBigIntToFiniteNumber(maximum) / SOLAR_MASS_IN_KILOGRAMS;
    validateImfRange(minimumSolarMass, maximumSolarMass, minimum, maximum);

    const rolledSolarMass = rollStarMassBetweenNumbers(
      minimumSolarMass,
      maximumSolarMass,
    );

    return projectNumberToBigIntRange(
      rolledSolarMass * SOLAR_MASS_IN_KILOGRAMS,
      minimum,
      maximum,
    ) as T;
  }

  throw new InvalidRollBetweenInputError(
    minimum,
    maximum,
    undefined,
    'Cannot roll between values of different numeric types',
  );
}

function validateNumberRange(
  minimum: number,
  maximum: number,
  options?: RollBetweenOptions,
): void {
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) {
    throw new InvalidRollBetweenInputError(
      minimum,
      maximum,
      options,
      'Cannot roll between non-finite number values',
    );
  }

  if (minimum <= 0 || maximum <= 0) {
    throw new InvalidRollBetweenInputError(
      minimum,
      maximum,
      options,
      'Cannot roll between non-positive number values',
    );
  }

  if (minimum >= maximum) {
    throw new InvalidRollBetweenInputError(
      minimum,
      maximum,
      options,
      'Cannot roll between a minimum that is not smaller than the maximum',
    );
  }

  validateOptions(minimum, maximum, options);
}

function validateBigIntRange(
  minimum: bigint,
  maximum: bigint,
  options?: RollBetweenOptions,
): void {
  if (minimum <= 0n || maximum <= 0n) {
    throw new InvalidRollBetweenInputError(
      minimum,
      maximum,
      options,
      'Cannot roll between non-positive bigint values',
    );
  }

  if (minimum >= maximum) {
    throw new InvalidRollBetweenInputError(
      minimum,
      maximum,
      options,
      'Cannot roll between a minimum that is not smaller than the maximum',
    );
  }

  validateOptions(minimum, maximum, options);
}

function validateOptions<T extends number | bigint>(
  minimum: T,
  maximum: T,
  options?: RollBetweenOptions,
): void {
  if (options?.strategy !== 'power-law') {
    return;
  }

  const exponent = options.exponent ?? DEFAULT_POWER_LAW_EXPONENT;

  if (!Number.isFinite(exponent) || exponent <= 0) {
    throw new InvalidRollBetweenInputError(
      minimum,
      maximum,
      options,
      'Cannot roll with a non-positive or non-finite power-law exponent',
    );
  }
}

function validateImfRange<T extends number | bigint>(
  minimumSolarMass: number,
  maximumSolarMass: number,
  originalMinimum?: T,
  originalMaximum?: T,
): void {
  if (minimumSolarMass < MINIMUM_IMF_SOLAR_MASS) {
    throw new InvalidRollBetweenInputError(
      (originalMinimum ?? minimumSolarMass) as T,
      (originalMaximum ?? maximumSolarMass) as T,
      undefined,
      `Cannot roll a star mass below ${String(MINIMUM_IMF_SOLAR_MASS)} solar masses`,
    );
  }
}

function rollNumberBetween(
  minimum: number,
  maximum: number,
  options: RollBetweenOptions,
): number {
  const unitRandom = Math.random();

  if (options.strategy === 'power-law') {
    const exponent = options.exponent ?? DEFAULT_POWER_LAW_EXPONENT;

    return clampNumberToRange(
      minimum + (maximum - minimum) * Math.pow(unitRandom, exponent),
      minimum,
      maximum,
    );
  }

  return clampNumberToRange(
    Math.exp(
      Math.log(minimum) + unitRandom * (Math.log(maximum) - Math.log(minimum)),
    ),
    minimum,
    maximum,
  );
}

function rollBigIntBetween(
  minimum: bigint,
  maximum: bigint,
  options: RollBetweenOptions,
): bigint {
  const minimumAsNumber = convertBigIntToFiniteNumber(minimum);
  const maximumAsNumber = convertBigIntToFiniteNumber(maximum);
  const rolledValue = rollNumberBetween(minimumAsNumber, maximumAsNumber, options);

  return projectNumberToBigIntRange(rolledValue, minimum, maximum);
}

function rollStarMassBetweenNumbers(
  minimumSolarMass: number,
  maximumSolarMass: number,
): number {
  const segments = getOverlappingImfSegments(minimumSolarMass, maximumSolarMass);
  const selectedSegment = selectImfSegment(segments);

  return clampNumberToRange(
    samplePowerLawSegment(
      selectedSegment.minimumSolarMass,
      selectedSegment.maximumSolarMass,
      selectedSegment.alpha,
      Math.random(),
    ),
    minimumSolarMass,
    maximumSolarMass,
  );
}

function getOverlappingImfSegments(
  minimumSolarMass: number,
  maximumSolarMass: number,
): ImfSegment[] {
  return IMF_SEGMENT_DEFINITIONS.flatMap((segment) => {
    const segmentMinimum = Math.max(minimumSolarMass, segment.minimumSolarMass);
    const segmentMaximum = Math.min(maximumSolarMass, segment.maximumSolarMass);

    if (segmentMinimum >= segmentMaximum) {
      return [];
    }

    return [
      {
        ...segment,
        minimumSolarMass: segmentMinimum,
        maximumSolarMass: segmentMaximum,
        weight: calculatePowerLawWeight(
          segmentMinimum,
          segmentMaximum,
          segment.alpha,
        ),
      },
    ];
  });
}

function selectImfSegment(segments: readonly ImfSegment[]): ImfSegment {
  const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
  const target = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const segment of segments) {
    cumulativeWeight += segment.weight;

    if (target < cumulativeWeight) {
      return segment;
    }
  }

  return segments[segments.length - 1]!;
}

function calculatePowerLawWeight(
  minimum: number,
  maximum: number,
  alpha: number,
): number {
  if (alpha === 1) {
    return Math.log(maximum / minimum);
  }

  const exponent = 1 - alpha;

  return (Math.pow(maximum, exponent) - Math.pow(minimum, exponent)) / exponent;
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

function convertBigIntToFiniteNumber(value: bigint): number {
  const result = Number(value);

  if (!Number.isFinite(result)) {
    throw new InvalidRollBetweenInputError(
      value,
      value,
      undefined,
      `Cannot convert bigint value ${String(value)} to a finite number`,
    );
  }

  return result;
}

function projectNumberToBigIntRange(
  value: number,
  minimum: bigint,
  maximum: bigint,
): bigint {
  const projectedValue = BigInt(Math.floor(value));

  if (projectedValue < minimum) {
    return minimum;
  }

  if (projectedValue > maximum) {
    return maximum;
  }

  return projectedValue;
}

function clampNumberToRange(
  value: number,
  minimum: number,
  maximum: number,
): number {
  if (value < minimum) {
    return minimum;
  }

  if (value > maximum) {
    return maximum;
  }

  return value;
}
