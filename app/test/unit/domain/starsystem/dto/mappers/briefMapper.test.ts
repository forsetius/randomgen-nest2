import { briefMapper } from '../../../../../../src/domain/starsystem/dto/mappers/briefMapper';
import {
  BinaryStarNode,
  SingleStarNode,
} from '../../../../../../src/domain/starsystem/domain/stellarHierarchy';
import { Star } from '../../../../../../src/domain/starsystem/domain/Star';
import { StarSystem } from '../../../../../../src/domain/starsystem/domain/StarSystem';
import {
  Acceleration,
  Length,
  Period,
} from '../../../../../../src/domain/starsystem/domain/valueObjects';
import { JUPITER_RADIUS_KM } from '../../../../../../src/domain/starsystem/domain/valueObjects/Length';
import {
  EARTH_MASS,
  JUPITER_MASS,
  Mass,
} from '../../../../../../src/domain/starsystem/domain/valueObjects/Mass';

describe('briefMapper', () => {
  it('maps a 1+2 ternary system to compact systems with barycentric planet grouping', () => {
    const root = new BinaryStarNode(
      new SingleStarNode(new Star(Mass.fromSunMasses(1.6))),
      new BinaryStarNode(
        new SingleStarNode(new Star(Mass.fromSunMasses(0.4))),
        new SingleStarNode(new Star(Mass.fromSunMasses(0.3))),
        'close',
      ),
      'wide',
    );
    const starSystem = new StarSystem(root, {
      rootBodyId: 'body-root-barycenter',
      referenceEpoch: 'J2000',
      defaultLengthUnit: 'au',
      defaultAngleUnit: 'deg',
      defaultTimeUnit: 'day',
      bodyIds: [
        'body-root-barycenter',
        'body-root-primary-star-a',
        'body-root-secondary-barycenter',
        'body-root-secondary-primary-star-b',
        'body-root-secondary-secondary-star-c',
        'body-root-primary-star-a-planet-i',
        'body-root-secondary-barycenter-planet-i',
        'body-root-secondary-secondary-star-c-planet-i',
      ],
      bodies: [
        {
          id: 'body-root-barycenter',
          type: 'barycenter',
          name: 'Root barycenter',
          memberBodyIds: [
            'body-root-primary-star-a',
            'body-root-secondary-barycenter',
          ],
          computedMass: Mass.fromSunMasses(2.3),
        },
        {
          id: 'body-root-primary-star-a',
          type: 'star',
          name: 'Star A',
          mass: Mass.fromSunMasses(1.6),
          luminosity: 5.2,
        },
        {
          id: 'body-root-secondary-barycenter',
          type: 'barycenter',
          name: 'Outer barycenter',
          memberBodyIds: [
            'body-root-secondary-primary-star-b',
            'body-root-secondary-secondary-star-c',
          ],
          computedMass: Mass.fromSunMasses(0.7),
        },
        {
          id: 'body-root-secondary-primary-star-b',
          type: 'star',
          name: 'Star B',
          mass: Mass.fromSunMasses(0.4),
          luminosity: 0.12,
        },
        {
          id: 'body-root-secondary-secondary-star-c',
          type: 'star',
          name: 'Star C',
          mass: Mass.fromSunMasses(0.3),
          luminosity: 0.05,
        },
        {
          id: 'body-root-primary-star-a-planet-i',
          type: 'planet',
          name: 'Star A I',
          orbitId: 'orbit-root-primary-star-a-planet-i',
          mass: new Mass(EARTH_MASS),
          shape: {
            meanRadius: new Length(6371n),
          },
          surfaceGravity: new Acceleration(9.80665),
          compositionClass: 'rocky',
          surfaceClass: 'airless',
        },
        {
          id: 'body-root-secondary-barycenter-planet-i',
          type: 'planet',
          name: 'Outer Binary I',
          orbitId: 'orbit-root-secondary-barycenter-planet-i',
          mass: new Mass(JUPITER_MASS),
          shape: {
            meanRadius: new Length(JUPITER_RADIUS_KM),
          },
          surfaceGravity: new Acceleration(24.807),
          compositionClass: 'gas',
          surfaceClass: 'cloudTop',
        },
        {
          id: 'body-root-secondary-secondary-star-c-planet-i',
          type: 'planet',
          name: 'Star C I',
          orbitId: 'orbit-root-secondary-secondary-star-c-planet-i',
          mass: new Mass(EARTH_MASS * 2n),
          shape: {
            meanRadius: new Length(8000n),
          },
          surfaceGravity: new Acceleration(12.4554455),
          compositionClass: 'rocky',
          surfaceClass: 'airless',
        },
      ],
      orbitIds: [
        'orbit-root-primary-star-a-planet-i',
        'orbit-root-secondary-barycenter-planet-i',
        'orbit-root-secondary-secondary-star-c-planet-i',
      ],
      orbits: [
        {
          id: 'orbit-root-primary-star-a-planet-i',
          primaryBodyId: 'body-root-primary-star-a',
          orbitingBodyId: 'body-root-primary-star-a-planet-i',
          kind: 'keplerian',
          frame: 'bodycentric',
          epoch: 'J2000',
          semiMajorAxis: new Length(149_597_870n),
          siderealPeriod: new Period(365.25),
          orbitClass: 'circumstellar',
        },
        {
          id: 'orbit-root-secondary-barycenter-planet-i',
          primaryBodyId: 'body-root-secondary-barycenter',
          orbitingBodyId: 'body-root-secondary-barycenter-planet-i',
          kind: 'keplerian',
          frame: 'barycentric',
          epoch: 'J2000',
          semiMajorAxis: new Length(750_000_000n),
          siderealPeriod: new Period(1200),
          orbitClass: 'circumbinary',
        },
        {
          id: 'orbit-root-secondary-secondary-star-c-planet-i',
          primaryBodyId: 'body-root-secondary-secondary-star-c',
          orbitingBodyId: 'body-root-secondary-secondary-star-c-planet-i',
          kind: 'keplerian',
          frame: 'bodycentric',
          epoch: 'J2000',
          semiMajorAxis: new Length(50_000_000n),
          siderealPeriod: new Period(120),
          orbitClass: 'circumstellar',
        },
      ],
      coOrbitalGroupIds: [],
      coOrbitalGroups: [],
    });

    const result = briefMapper(starSystem);

    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(result.topology).toBe('ternary (single + close binary)');
    expect(result.systems).toHaveLength(2);
    expect(result.systems[0]).toEqual({
      name: 'inner system',
      stars: [
        {
          id: 'body-root-primary-star-a',
          name: 'Star A',
          positionInSystem: 'sole',
          stellarClass: 'unknown',
          mass: '1.60 M☉',
          luminosity: '5.20 L☉',
        },
      ],
      planets: [
        {
          id: 'body-root-primary-star-a-planet-i',
          name: 'Star A I',
          hostBody: 'Star A',
          semiMajorAxis: '1.00 AU',
          mass: '1.00 M🜨',
          meanRadius: '1.00 R🜨',
          gravity: '1.00 g🜨',
          surfaceClass: 'airless',
        },
      ],
    });
    expect(result.systems[1]).toEqual({
      name: 'outer system',
      stars: [
        {
          id: 'body-root-secondary-primary-star-b',
          name: 'Star B',
          positionInSystem: 'primary',
          stellarClass: 'unknown',
          mass: '0.40 M☉',
          luminosity: '0.12 L☉',
        },
        {
          id: 'body-root-secondary-secondary-star-c',
          name: 'Star C',
          positionInSystem: 'secondary',
          stellarClass: 'unknown',
          mass: '0.30 M☉',
          luminosity: '0.05 L☉',
        },
      ],
      planets: [
        {
          id: 'body-root-secondary-secondary-star-c-planet-i',
          name: 'Star C I',
          hostBody: 'Star C',
          semiMajorAxis: '0.33 AU',
          mass: '2.00 M🜨',
          meanRadius: '1.26 R🜨',
          gravity: '1.27 g🜨',
          surfaceClass: 'airless',
        },
        {
          id: 'body-root-secondary-barycenter-planet-i',
          name: 'Outer Binary I',
          hostBody: 'Outer barycenter',
          semiMajorAxis: '5.01 AU',
          mass: '1.00 M♃',
          meanRadius: '1.00 R♃',
          gravity: '2.53 g🜨',
          surfaceClass: 'cloudTop',
        },
      ],
    });
  });

  it('maps a close binary to a single system entry', () => {
    const root = new BinaryStarNode(
      new SingleStarNode(new Star(Mass.fromSunMasses(1))),
      new SingleStarNode(new Star(Mass.fromSunMasses(0.8))),
      'close',
    );
    const starSystem = new StarSystem(root);

    const result = briefMapper(starSystem);

    expect(result.topology).toBe('close binary');
    expect(result.systems).toHaveLength(1);
    expect(result.systems[0]?.name).toBe('system');
    expect(result.systems[0]?.stars).toHaveLength(2);
    expect(result.systems[0]?.stars[0]?.positionInSystem).toBe('primary');
    expect(result.systems[0]?.stars[1]?.positionInSystem).toBe('secondary');
  });
});
