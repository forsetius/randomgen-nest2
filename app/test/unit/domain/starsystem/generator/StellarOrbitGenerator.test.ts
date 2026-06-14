import {
  BinaryStarNode,
  SingleStarNode,
} from '../../../../../src/domain/starsystem/domain/stellarHierarchy';
import { Star } from '../../../../../src/domain/starsystem/domain/Star';
import { Mass } from '../../../../../src/domain/starsystem/domain/valueObjects';
import { StellarOrbitGenerator } from '../../../../../src/domain/starsystem/generator/StellarOrbitGenerator';
import type { StarData } from '../../../../../src/domain/starsystem/types';

describe('StellarOrbitGenerator', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('splits stellar semi-major axes around a barycenter according to the inverse mass ratio', () => {
    const root = new BinaryStarNode(
      new SingleStarNode(new Star(Mass.fromSunMasses(2))),
      new SingleStarNode(new Star(Mass.fromSunMasses(1))),
      'close',
    );
    mockRandomSequence([0.2, 0.15, 0.3, 0.45]);
    const generator = new StellarOrbitGenerator();

    const result = generator.generate(root);
    const starA = result.starSystemData.bodies.find(
      (body): body is StarData =>
        body.type === 'star' && body.name === 'Star A',
    );
    const starB = result.starSystemData.bodies.find(
      (body): body is StarData =>
        body.type === 'star' && body.name === 'Star B',
    );

    expect(starA?.orbitId).toEqual(expect.any(String));
    expect(starB?.orbitId).toEqual(expect.any(String));

    const orbitById = new Map(
      result.starSystemData.orbits.map((orbit) => [orbit.id, orbit]),
    );
    const starAOrbit = orbitById.get(starA?.orbitId ?? '');
    const starBOrbit = orbitById.get(starB?.orbitId ?? '');

    expect(starAOrbit?.primaryBodyId).toBe('body-root-barycenter');
    expect(starBOrbit?.primaryBodyId).toBe('body-root-barycenter');

    const starASemiMajorAxis = starAOrbit?.semiMajorAxis?.getAsAU() ?? 0;
    const starBSemiMajorAxis = starBOrbit?.semiMajorAxis?.getAsAU() ?? 0;

    expect(starASemiMajorAxis).toBeGreaterThan(0);
    expect(starBSemiMajorAxis).toBeGreaterThan(0);
    expect(starASemiMajorAxis / starBSemiMajorAxis).toBeCloseTo(0.5, 4);
    expect(starAOrbit?.siderealPeriod?.getAsDays()).toBeCloseTo(
      starBOrbit?.siderealPeriod?.getAsDays() ?? 0,
      6,
    );
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
