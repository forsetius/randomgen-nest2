import { StarSystemController } from '../../../../src/domain/starsystem/StarSystemController';
import { SingleStarNode } from '../../../../src/domain/starsystem/domain/stellarHierarchy';
import { Star } from '../../../../src/domain/starsystem/domain/Star';
import { StarSystem } from '../../../../src/domain/starsystem/domain/StarSystem';
import {
  Mass,
  SUN_MASS,
} from '../../../../src/domain/starsystem/domain/valueObjects/Mass';
import type { StarSystemGenerator } from '../../../../src/domain/starsystem/generator/StarSystemGenerator';
import {
  Acceleration,
  Length,
  Period,
} from '../../../../src/domain/starsystem/domain/valueObjects';

describe('StarSystemController', () => {
  it('returns the wrapped star system response shape', () => {
    const generator = {
      generate: jest.fn(() => {
        return new StarSystem(new SingleStarNode(new Star(new Mass(SUN_MASS))));
      }),
    } satisfies Pick<StarSystemGenerator, 'generate'>;

    const controller = new StarSystemController(
      generator as unknown as StarSystemGenerator,
    );

    const result = controller.generate({ lang: 'en' });

    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(result.name).toEqual(expect.any(String));
    expect(result.starSystem.rootBodyId).toBe('body-root-star-a');
    expect(result.starSystem.bodies).toEqual([
      {
        id: 'body-root-star-a',
        type: 'star',
        name: 'Star A',
        mass: new Mass(SUN_MASS),
      },
    ]);
    expect(result.starSystem.orbits).toEqual([]);
    expect(result.starSystem.coOrbitalGroups).toEqual([]);
    expect(result).not.toHaveProperty('root');
  });

  it('returns precomputed canonical system data when the generator provides it', () => {
    const root = new SingleStarNode(new Star(new Mass(SUN_MASS)));
    const generator = {
      generate: jest.fn(() => {
        return new StarSystem(root, {
          rootBodyId: 'body-root-star-a',
          referenceEpoch: 'J2000',
          defaultLengthUnit: 'au',
          defaultAngleUnit: 'deg',
          defaultTimeUnit: 'day',
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
              name: 'Star A I',
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
              semiMajorAxis: new Length(149_597_870n),
              eccentricity: 0.03,
              inclination: 0,
              longitudeOfAscendingNode: 0,
              argumentOfPeriapsis: 45,
              meanAnomalyAtEpoch: 180,
              siderealPeriod: new Period(365.25),
              orbitClass: 'circumstellar',
              stabilityClass: 'stable',
            },
          ],
          coOrbitalGroupIds: [],
          coOrbitalGroups: [],
        });
      }),
    } satisfies Pick<StarSystemGenerator, 'generate'>;

    const controller = new StarSystemController(
      generator as unknown as StarSystemGenerator,
    );

    const result = controller.generate({ lang: 'en' });

    expect(result.starSystem.bodyIds).toContain('body-root-star-a-planet-i');
    expect(result.starSystem.orbits).toHaveLength(1);
    expect(result.starSystem.orbits[0]?.orbitingBodyId).toBe(
      'body-root-star-a-planet-i',
    );
  });

  it('returns a brief hierarchical summary from the dedicated endpoint', () => {
    const root = new SingleStarNode(new Star(new Mass(SUN_MASS)));
    const generator = {
      generate: jest.fn(() => {
        return new StarSystem(root, {
          rootBodyId: 'body-root-star-a',
          referenceEpoch: 'J2000',
          defaultLengthUnit: 'au',
          defaultAngleUnit: 'deg',
          defaultTimeUnit: 'day',
          bodyIds: ['body-root-star-a', 'body-root-star-a-planet-i'],
          bodies: [
            {
              id: 'body-root-star-a',
              type: 'star',
              name: 'Star A',
              mass: new Mass(SUN_MASS),
              luminosity: 1,
            },
            {
              id: 'body-root-star-a-planet-i',
              type: 'planet',
              name: 'Star A I',
              orbitId: 'orbit-root-star-a-planet-i',
              mass: new Mass(SUN_MASS / 333_000n),
              shape: {
                meanRadius: new Length(6371n),
              },
              surfaceGravity: new Acceleration(9.80665),
              compositionClass: 'rocky',
              surfaceClass: 'airless',
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
              semiMajorAxis: new Length(149_597_870n),
              eccentricity: 0.03,
              inclination: 0,
              longitudeOfAscendingNode: 0,
              argumentOfPeriapsis: 45,
              meanAnomalyAtEpoch: 180,
              siderealPeriod: new Period(365.25),
              orbitClass: 'circumstellar',
              stabilityClass: 'stable',
            },
          ],
          coOrbitalGroupIds: [],
          coOrbitalGroups: [],
        });
      }),
    } satisfies Pick<StarSystemGenerator, 'generate'>;

    const controller = new StarSystemController(
      generator as unknown as StarSystemGenerator,
    );

    const result = controller.generateBrief({ lang: 'en' });

    expect(result.topology).toBe('single');
    expect(result.systems).toEqual([
      {
        name: 'system',
        stars: [
          {
            id: 'body-root-star-a',
            name: 'Star A',
            positionInSystem: 'sole',
            stellarClass: 'unknown',
            mass: '1.00 M☉',
            luminosity: '1.00 L☉',
          },
        ],
        planets: [
          {
            id: 'body-root-star-a-planet-i',
            name: 'Star A I',
            hostBody: 'Star A',
            semiMajorAxis: '1.00 AU',
            mass: '1.00 M🜨',
            meanRadius: '1.00 R🜨',
            gravity: '1.00 g🜨',
            surfaceClass: 'airless',
          },
        ],
      },
    ]);
  });
});
