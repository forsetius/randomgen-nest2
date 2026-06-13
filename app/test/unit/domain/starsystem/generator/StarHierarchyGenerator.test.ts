import {
  MIN_STAR_MASS,
  SUN_MASS,
} from '../../../../../src/domain/starsystem/domain/valueObjects/Mass';
import { StarHierarchyGenerator } from '../../../../../src/domain/starsystem/generator/StarHierarchyGenerator';
import { StarFactory } from '../../../../../src/domain/starsystem/generator/StarFactory';
import {
  rollBetween,
  rollStarMassBetween,
} from '../../../../../src/domain/starsystem/util/rollBetween';

jest.mock('../../../../../src/domain/starsystem/util/rollBetween', () => {
  const actual = jest.requireActual<
    typeof import('../../../../../src/domain/starsystem/util/rollBetween')
  >('../../../../../src/domain/starsystem/util/rollBetween');

  return {
    ...actual,
    rollBetween: jest.fn(actual.rollBetween),
    rollStarMassBetween: jest.fn(),
  };
});

const rollBetweenMock = jest.mocked(rollBetween);
const rollStarMassBetweenMock = jest.mocked(rollStarMassBetween);
const actualRollBetween = jest.requireActual<
  typeof import('../../../../../src/domain/starsystem/util/rollBetween')
>('../../../../../src/domain/starsystem/util/rollBetween').rollBetween;

describe('StarHierarchyGenerator', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    rollBetweenMock.mockReset();
    rollBetweenMock.mockImplementation(actualRollBetween);
    rollStarMassBetweenMock.mockReset();
  });

  it.each([
    ['single', 1n, [0.1]],
    ['binary(close)', 2n, [0.5, 0.2, 0.4]],
    ['binary(wide)', 2n, [0.5, 0.8, 0.4]],
    ['binary(wide:binary,single)', 2n, [0.95, 0.3, 0.4]],
    ['binary(wide:single,binary)', 20n, [0.95, 0.8, 0.3, 0.4]],
  ] as const)(
    'can generate the %s topology',
    (expectedTopology, primarySolarMasses, randomSequence) => {
      rollStarMassBetweenMock.mockReturnValue(primarySolarMasses * SUN_MASS);
      mockRandomSequence(randomSequence);
      const generator = new StarHierarchyGenerator(new StarFactory());

      const starSystem = generator.generate();

      expect(describeTopology(starSystem.root)).toBe(expectedTopology);
    },
  );

  it('always keeps the primary branch heavier in wide hierarchies', () => {
    rollStarMassBetweenMock.mockReturnValue(20n * SUN_MASS);
    mockRandomSequence([0.95, 0.8, 0.3, 0.4]);
    const generator = new StarHierarchyGenerator(new StarFactory());

    const starSystem = generator.generate();

    expect(starSystem.root.kind).toBe('binary');
    if (starSystem.root.kind !== 'binary') {
      throw new Error('Expected a wide binary root');
    }

    expect(starSystem.root.primary.mass.value).toBeGreaterThanOrEqual(
      starSystem.root.secondary.mass.value,
    );
  });

  it('never produces stars below the minimum stellar mass', () => {
    rollStarMassBetweenMock.mockReturnValue(2n * SUN_MASS);
    mockRandomSequence([0.95, 0.3, 0.4]);
    const generator = new StarHierarchyGenerator(new StarFactory());

    const starSystem = generator.generate();

    starSystem.stars.forEach((star) => {
      expect(star.mass.value).toBeGreaterThanOrEqual(MIN_STAR_MASS);
    });
  });

  it('clamps close-binary companion masses to at least the minimum stellar mass', () => {
    rollStarMassBetweenMock.mockReturnValue(2n * SUN_MASS);
    rollBetweenMock.mockImplementation((minimum) => minimum);
    mockRandomSequence([0.5, 0.2]);
    const generator = new StarHierarchyGenerator(new StarFactory());

    const starSystem = generator.generate();

    expect(starSystem.root.kind).toBe('binary');
    if (starSystem.root.kind !== 'binary') {
      throw new Error('Expected a close binary root');
    }

    expect(starSystem.root.secondary.mass.value).toBeGreaterThanOrEqual(
      MIN_STAR_MASS,
    );
  });

  it('clamps the outer binary primary mass to at least the minimum stellar mass', () => {
    rollStarMassBetweenMock.mockReturnValue(20n * SUN_MASS);
    rollBetweenMock.mockImplementation((minimum) => minimum);
    mockRandomSequence([0.95, 0.8]);
    const generator = new StarHierarchyGenerator(new StarFactory());

    const starSystem = generator.generate();

    expect(starSystem.root.kind).toBe('binary');
    if (starSystem.root.kind !== 'binary') {
      throw new Error('Expected a wide binary root');
    }

    expect(starSystem.root.secondary.kind).toBe('binary');
    if (starSystem.root.secondary.kind !== 'binary') {
      throw new Error('Expected the outer branch to be a close binary');
    }

    expect(starSystem.root.secondary.primary.mass.value).toBeGreaterThanOrEqual(
      MIN_STAR_MASS,
    );
  });
});

function describeTopology(node: {
  readonly kind: 'single' | 'binary';
  readonly separation?: 'close' | 'wide';
  readonly primary?: unknown;
  readonly secondary?: unknown;
}): string {
  if (node.kind === 'single') {
    return 'single';
  }

  const primaryTopology = describeTopology(
    node.primary as Parameters<typeof describeTopology>[0],
  );
  const secondaryTopology = describeTopology(
    node.secondary as Parameters<typeof describeTopology>[0],
  );

  if (node.separation === 'close') {
    return 'binary(close)';
  }

  if (primaryTopology === 'single' && secondaryTopology === 'single') {
    return 'binary(wide)';
  }

  return `binary(wide:${primaryTopology.replace('binary(close)', 'binary')},${secondaryTopology.replace('binary(close)', 'binary')})`;
}

function mockRandomSequence(
  values: readonly number[],
): jest.SpiedFunction<typeof Math.random> {
  let index = 0;

  return jest.spyOn(Math, 'random').mockImplementation(() => {
    const nextValue = values[index] ?? values[values.length - 1];
    index += 1;

    return nextValue ?? 0;
  });
}
