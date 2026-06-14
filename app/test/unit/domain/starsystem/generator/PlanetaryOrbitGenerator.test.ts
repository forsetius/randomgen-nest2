import {
  Mass,
  SUN_MASS,
} from '../../../../../src/domain/starsystem/domain/valueObjects/Mass';
import { PlanetaryOrbitGenerator } from '../../../../../src/domain/starsystem/generator/PlanetaryOrbitGenerator';
import type { PlanetaryHostZone } from '../../../../../src/domain/starsystem/generator/OrbitalZoneDeriver';
import type { StarSystemData } from '../../../../../src/domain/starsystem/types';

describe('PlanetaryOrbitGenerator', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('places stable planets inside the available host zone with mutual Hill spacing', () => {
    mockRandomSequence([
      0.2, 0.4, 0.3, 0.35, 0.3, 0.25, 0.4, 0.5, 0.3, 0.4, 0.2, 0.6,
    ]);
    const generator = new PlanetaryOrbitGenerator();
    const baseData: StarSystemData = {
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
    const hostZones: readonly PlanetaryHostZone[] = [
      {
        id: 'host-zone-star-a',
        hostBodyId: 'body-root-star-a',
        hostBodyType: 'star',
        orbitClass: 'circumstellar',
        hostName: 'Star A',
        hostMass: new Mass(SUN_MASS),
        innerBoundaryAu: 0.45,
        outerBoundaryAu: 6,
        parentStarIds: ['body-root-star-a'],
      },
    ];

    const result = generator.generate(baseData, hostZones);
    const planets = result.bodies.filter((body) => body.type === 'planet');
    const planetaryOrbits = result.orbits.filter(
      (orbit) => orbit.orbitClass === 'circumstellar',
    );

    expect(planets.length).toBeGreaterThan(0);
    expect(planetaryOrbits.length).toBe(planets.length);

    const semiMajorAxes = planetaryOrbits.map(
      (orbit) => orbit.semiMajorAxis?.getAsAU() ?? 0,
    );

    expect(semiMajorAxes).toEqual([...semiMajorAxes].sort((a, b) => a - b));

    planetaryOrbits.forEach((orbit) => {
      const eccentricity = orbit.eccentricity ?? 0;
      const semiMajorAxis = orbit.semiMajorAxis?.getAsAU() ?? 0;

      expect(semiMajorAxis * (1 - eccentricity)).toBeGreaterThanOrEqual(0.45);
      expect(semiMajorAxis * (1 + eccentricity)).toBeLessThanOrEqual(6);
      expect(orbit.primaryBodyId).toBe('body-root-star-a');
    });

    for (let i = 0; i < planets.length - 1; i += 1) {
      const currentPlanet = planets[i];
      const nextPlanet = planets[i + 1];
      const currentOrbit = planetaryOrbits[i];
      const nextOrbit = planetaryOrbits[i + 1];

      if (
        currentPlanet?.type !== 'planet' ||
        nextPlanet?.type !== 'planet' ||
        currentOrbit?.semiMajorAxis == null ||
        nextOrbit?.semiMajorAxis == null ||
        currentPlanet.mass == null ||
        nextPlanet.mass == null
      ) {
        throw new Error('Expected adjacent planets with masses and orbits');
      }

      const currentSemiMajorAxis = currentOrbit.semiMajorAxis.getAsAU();
      const nextSemiMajorAxis = nextOrbit.semiMajorAxis.getAsAU();
      const meanSemiMajorAxis = (currentSemiMajorAxis + nextSemiMajorAxis) / 2;
      const mutualHillRadius =
        Math.pow(
          (currentPlanet.mass.getAsSunMass() + nextPlanet.mass.getAsSunMass()) /
            (3 * hostZones[0]!.hostMass.getAsSunMass()),
          1 / 3,
        ) * meanSemiMajorAxis;

      expect(
        (nextSemiMajorAxis - currentSemiMajorAxis) / mutualHillRadius,
      ).toBeGreaterThanOrEqual(8);
    }
  });
});

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
