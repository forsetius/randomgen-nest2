import { Mass } from '../valueObjects';
import { Star } from '../Star';

export type StarHierarchyNode = SingleStarNode | BinaryStarNode;
export type BinarySeparation = 'close' | 'wide';

export interface SingleStarNode {
  readonly kind: 'single';
  readonly star: Star;
  readonly mass: Mass;
  readonly stars: readonly Star[];
  readonly starCount: number;
}

export interface BinaryStarNode {
  readonly kind: 'binary';
  readonly separation: BinarySeparation;
  readonly primary: StarHierarchyNode;
  readonly secondary: StarHierarchyNode;
  readonly mass: Mass;
  readonly stars: readonly Star[];
  readonly starCount: number;
}
