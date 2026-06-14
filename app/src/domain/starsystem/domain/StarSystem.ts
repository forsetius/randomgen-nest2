import type { StarHierarchyNode } from './stellarHierarchy';
import { Mass } from './valueObjects';
import { Star } from './Star';
import type { StarSystemData } from '../types';

export class StarSystem {
  public constructor(
    public readonly root: StarHierarchyNode,
    public readonly data?: StarSystemData,
  ) {}

  public get mass(): Mass {
    return this.root.mass;
  }

  public get stars(): readonly Star[] {
    return this.root.stars;
  }

  public get starCount(): number {
    return this.root.starCount;
  }
}
