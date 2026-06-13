import { Mass } from '../valueObjects';
import { Star } from '../Star';
import type { SingleStarNode as SingleStarNodeContract } from './StarHierarchyNode';

export class SingleStarNode implements SingleStarNodeContract {
  public readonly kind = 'single' as const;
  public readonly starCount = 1;

  public constructor(public readonly star: Star) {}

  public get mass(): Mass {
    return this.star.mass;
  }

  public get stars(): readonly Star[] {
    return [this.star];
  }
}
