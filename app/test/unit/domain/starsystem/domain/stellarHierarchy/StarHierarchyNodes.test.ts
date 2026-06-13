import {
  BinaryStarNode,
  SingleStarNode,
} from '../../../../../../src/domain/starsystem/domain/stellarHierarchy';
import { Star } from '../../../../../../src/domain/starsystem/domain/Star';
import { Mass } from '../../../../../../src/domain/starsystem/domain/valueObjects';

describe('stellar hierarchy nodes', () => {
  it('aggregates mass and stars for a close binary', () => {
    const primaryStar = createStar(2);
    const secondaryStar = createStar(1);

    const node = new BinaryStarNode(
      new SingleStarNode(primaryStar),
      new SingleStarNode(secondaryStar),
      'close',
    );

    expect(node.mass.value).toBe(3n);
    expect(node.starCount).toBe(2);
    expect(node.stars).toEqual([primaryStar, secondaryStar]);
  });

  it('reorders children so the primary branch is more massive', () => {
    const heavierStar = createStar(3);
    const lighterStar = createStar(1);

    const node = new BinaryStarNode(
      new SingleStarNode(lighterStar),
      new SingleStarNode(heavierStar),
      'wide',
    );

    expect(node.primary.mass.value).toBe(3n);
    expect(node.secondary.mass.value).toBe(1n);
  });

  it('rejects close binaries with nested binary children', () => {
    const nestedBinary = new BinaryStarNode(
      new SingleStarNode(createStar(2)),
      new SingleStarNode(createStar(1)),
      'close',
    );

    expect(
      () =>
        new BinaryStarNode(
          nestedBinary,
          new SingleStarNode(createStar(1)),
          'close',
        ),
    ).toThrow('close binary');
  });
});

function createStar(solarMasses: number): Star {
  return new Star(new Mass(BigInt(Math.trunc(solarMasses))));
}
