import { SingleStarNode } from '../../../../../src/domain/starsystem/domain/stellarHierarchy';
import { Star } from '../../../../../src/domain/starsystem/domain/Star';
import { StarSystem } from '../../../../../src/domain/starsystem/domain/StarSystem';
import {
  Mass,
  SUN_MASS,
} from '../../../../../src/domain/starsystem/domain/valueObjects/Mass';
import { OrbitalZoneDeriver } from '../../../../../src/domain/starsystem/generator/OrbitalZoneDeriver';
import { PlanetaryOrbitGenerator } from '../../../../../src/domain/starsystem/generator/PlanetaryOrbitGenerator';
import { StarHierarchyGenerator } from '../../../../../src/domain/starsystem/generator/StarHierarchyGenerator';
import { StarSystemGenerator } from '../../../../../src/domain/starsystem/generator/StarSystemGenerator';
import { StellarOrbitGenerator } from '../../../../../src/domain/starsystem/generator/StellarOrbitGenerator';
import type { StarSystemData } from '../../../../../src/domain/starsystem/types';

describe('StarSystemGenerator', () => {
  it('retries system generation until at least one planet exists anywhere in the system', () => {
    const root = new SingleStarNode(new Star(new Mass(SUN_MASS)));
    const hierarchyGenerator = {
      generate: jest
        .fn()
        .mockReturnValueOnce(new StarSystem(root))
        .mockReturnValueOnce(new StarSystem(root))
        .mockReturnValueOnce(new StarSystem(root)),
    } as unknown as StarHierarchyGenerator;
    const stellarOrbitGenerator = {
      generate: jest.fn(() => ({
        starSystemData: createStarOnlySystemData(),
      })),
    } as unknown as StellarOrbitGenerator;
    const orbitalZoneDeriver = {
      derive: jest.fn(() => []),
    } as unknown as OrbitalZoneDeriver;
    const planetaryOrbitGenerator = {
      generate: jest
        .fn()
        .mockReturnValueOnce(createStarOnlySystemData())
        .mockReturnValueOnce(createStarOnlySystemData())
        .mockReturnValueOnce(createSystemDataWithPlanet()),
    } as unknown as PlanetaryOrbitGenerator;
    const generator = new StarSystemGenerator(
      hierarchyGenerator,
      stellarOrbitGenerator,
      orbitalZoneDeriver,
      planetaryOrbitGenerator,
      {
        contentDir: 'content/starsystem',
        supportedLangs: ['en', 'pl'],
        additionalPlanetBearingSystemAttempts: 3,
      },
    );

    const result = generator.generate();

    expect(
      result.data?.bodies.some((body) => body.type === 'planet'),
    ).toBeTruthy();
    expect(
      (planetaryOrbitGenerator.generate as jest.Mock).mock.calls,
    ).toHaveLength(3);
  });

  it('returns the last generated stellar system without planets after exhausting retries', () => {
    const root = new SingleStarNode(new Star(new Mass(SUN_MASS)));
    const hierarchyGenerator = {
      generate: jest
        .fn()
        .mockReturnValueOnce(new StarSystem(root))
        .mockReturnValueOnce(new StarSystem(root))
        .mockReturnValueOnce(new StarSystem(root)),
    } as unknown as StarHierarchyGenerator;
    const stellarOrbitGenerator = {
      generate: jest.fn(() => ({
        starSystemData: createStarOnlySystemData(),
      })),
    } as unknown as StellarOrbitGenerator;
    const orbitalZoneDeriver = {
      derive: jest.fn(() => []),
    } as unknown as OrbitalZoneDeriver;
    const planetaryOrbitGenerator = {
      generate: jest.fn(() => createStarOnlySystemData()),
    } as unknown as PlanetaryOrbitGenerator;
    const generator = new StarSystemGenerator(
      hierarchyGenerator,
      stellarOrbitGenerator,
      orbitalZoneDeriver,
      planetaryOrbitGenerator,
      {
        contentDir: 'content/starsystem',
        supportedLangs: ['en', 'pl'],
        additionalPlanetBearingSystemAttempts: 2,
      },
    );

    const result = generator.generate();

    expect(result.data?.bodies.some((body) => body.type === 'planet')).toBe(
      false,
    );
    expect(
      (planetaryOrbitGenerator.generate as jest.Mock).mock.calls,
    ).toHaveLength(3);
  });
});

function createStarOnlySystemData(): StarSystemData {
  return {
    rootBodyId: 'body-root-star-a',
    referenceEpoch: 'J2000',
    defaultLengthUnit: 'au',
    defaultAngleUnit: 'deg',
    defaultTimeUnit: 'day',
    bodyIds: ['body-root-star-a'],
    bodies: [
      {
        id: 'body-root-star-a',
        type: 'star',
        name: 'Star A',
        mass: new Mass(SUN_MASS),
      },
    ],
    orbitIds: [],
    orbits: [],
    coOrbitalGroupIds: [],
    coOrbitalGroups: [],
  };
}

function createSystemDataWithPlanet(): StarSystemData {
  return {
    ...createStarOnlySystemData(),
    bodyIds: ['body-root-star-a', 'body-root-star-a-planet-i'],
    bodies: [
      {
        id: 'body-root-star-a',
        type: 'star',
        name: 'Star A',
        mass: new Mass(SUN_MASS),
      },
      {
        id: 'body-root-star-a-planet-i',
        type: 'planet',
        name: 'Planet I',
        orbitId: 'orbit-root-star-a-planet-i',
      },
    ],
    orbitIds: ['orbit-root-star-a-planet-i'],
    orbits: [
      {
        id: 'orbit-root-star-a-planet-i',
        primaryBodyId: 'body-root-star-a',
        orbitingBodyId: 'body-root-star-a-planet-i',
        kind: 'keplerian',
        frame: 'bodycentric',
        epoch: 'J2000',
        orbitClass: 'circumstellar',
      },
    ],
  };
}
