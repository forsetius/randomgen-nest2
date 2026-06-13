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
  it('returns the hierarchical response shape', () => {
    const generator = {
      generate: jest.fn(() => {
        return new StarSystem(new SingleStarNode(new Star(new Mass(SUN_MASS))));
      }),
    } satisfies Pick<StarSystemGenerator, 'generate'>;

    const controller = new StarSystemController(
      generator as unknown as StarSystemGenerator,
    );

    const result = controller.generate({ lang: 'en' });

    expect(result).toHaveProperty('root');
    expect(result.root.kind).toBe('single');
    expect(result).not.toHaveProperty('innerSystem');
    expect(result).not.toHaveProperty('outerSystem');
  });
});
