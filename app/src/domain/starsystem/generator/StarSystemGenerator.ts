import { StarSystem } from '../domain/StarSystem';
import { StarHierarchyGenerator } from './StarHierarchyGenerator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StarSystemGenerator {
  public constructor(
    private readonly starHierarchyGenerator: StarHierarchyGenerator,
  ) {}

  public generate(): StarSystem {
    return this.starHierarchyGenerator.generate();
  }
}
