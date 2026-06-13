import { StarSystem } from '../domain/StarSystem';
import { StarHierarchyGenerator } from './StarHierarchyGenerator';

export class StarSystemGenerator {
  public constructor(
    private readonly starHierarchyGenerator: StarHierarchyGenerator,
  ) {}

  public generate(): StarSystem {
    return this.starHierarchyGenerator.generate();
  }
}
