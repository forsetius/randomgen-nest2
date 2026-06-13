import { Mass } from '../valueObjects';
import { Star } from '../Star';
import type {
  BinarySeparation,
  BinaryStarNode as BinaryStarNodeContract,
  StarHierarchyNode,
} from './StarHierarchyNode';

export class BinaryStarNode implements BinaryStarNodeContract {
  public readonly kind = 'binary' as const;
  public readonly primary: StarHierarchyNode;
  public readonly secondary: StarHierarchyNode;

  public constructor(
    firstNode: StarHierarchyNode,
    secondNode: StarHierarchyNode,
    public readonly separation: BinarySeparation,
  ) {
    if (
      separation === 'close' &&
      (firstNode.kind === 'binary' || secondNode.kind === 'binary')
    ) {
      throw new Error('A close binary cannot contain a nested binary child');
    }

    if (firstNode.mass.value >= secondNode.mass.value) {
      this.primary = firstNode;
      this.secondary = secondNode;
    } else {
      this.primary = secondNode;
      this.secondary = firstNode;
    }
  }

  public get mass(): Mass {
    return this.primary.mass.plus(this.secondary.mass);
  }

  public get stars(): readonly Star[] {
    return [...this.primary.stars, ...this.secondary.stars];
  }

  public get starCount(): number {
    return this.primary.starCount + this.secondary.starCount;
  }
}
