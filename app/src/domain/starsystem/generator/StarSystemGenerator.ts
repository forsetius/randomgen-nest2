import { Inject, Injectable } from '@nestjs/common';
import { StarSystem } from '../domain/StarSystem';
import { StarHierarchyGenerator } from './StarHierarchyGenerator';
import {
  type StarSystemModuleConfig,
  StarSystemModuleConfigContract,
} from '../types';
import { StellarOrbitGenerator } from './StellarOrbitGenerator';
import { OrbitalZoneDeriver } from './OrbitalZoneDeriver';
import { PlanetaryOrbitGenerator } from './PlanetaryOrbitGenerator';

@Injectable()
export class StarSystemGenerator {
  public constructor(
    private readonly starHierarchyGenerator: StarHierarchyGenerator,
    private readonly stellarOrbitGenerator: StellarOrbitGenerator,
    private readonly orbitalZoneDeriver: OrbitalZoneDeriver,
    private readonly planetaryOrbitGenerator: PlanetaryOrbitGenerator,
    @Inject(StarSystemModuleConfigContract.token)
    private readonly config: StarSystemModuleConfig,
  ) {}

  public generate(): StarSystem {
    const maximumAttempts =
      1 + this.config.additionalPlanetBearingSystemAttempts;
    let lastGeneratedSystem: StarSystem | undefined;

    for (
      let attemptIndex = 0;
      attemptIndex < maximumAttempts;
      attemptIndex += 1
    ) {
      const starHierarchy = this.starHierarchyGenerator.generate();
      const stellarOrbitGenerationResult = this.stellarOrbitGenerator.generate(
        starHierarchy.root,
      );
      const hostZones = this.orbitalZoneDeriver.derive(
        stellarOrbitGenerationResult,
      );
      const starSystemData = this.planetaryOrbitGenerator.generate(
        stellarOrbitGenerationResult.starSystemData,
        hostZones,
      );

      lastGeneratedSystem = new StarSystem(starHierarchy.root, starSystemData);

      if (starSystemData.bodies.some((body) => body.type === 'planet')) {
        return lastGeneratedSystem;
      }
    }

    return lastGeneratedSystem ?? this.starHierarchyGenerator.generate();
  }
}
