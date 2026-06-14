import { StarSystemController } from '../../../../src/domain/starsystem/StarSystemController';
import { SingleStarNode } from '../../../../src/domain/starsystem/domain/stellarHierarchy';
import { Star } from '../../../../src/domain/starsystem/domain/Star';
import { StarSystem } from '../../../../src/domain/starsystem/domain/StarSystem';
import {
  Mass,
  SUN_MASS,
} from '../../../../src/domain/starsystem/domain/valueObjects/Mass';
import type { StarSystemGenerator } from '../../../../src/domain/starsystem/generator/StarSystemGenerator';

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
});
