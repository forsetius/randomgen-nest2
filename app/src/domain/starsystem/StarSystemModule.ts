import { Module } from '@nestjs/common';
import { StarSystemController } from './StarSystemController';
import { OrbitalZoneDeriver } from './generator/OrbitalZoneDeriver';
import { PlanetaryOrbitGenerator } from './generator/PlanetaryOrbitGenerator';
import { StarSystemGenerator } from './generator/StarSystemGenerator';
import { StarFactory } from './generator/StarFactory';
import { StarHierarchyGenerator } from './generator/StarHierarchyGenerator';
import { StellarOrbitGenerator } from './generator/StellarOrbitGenerator';

@Module({
  providers: [
    StarFactory,
    StarHierarchyGenerator,
    StellarOrbitGenerator,
    OrbitalZoneDeriver,
    PlanetaryOrbitGenerator,
    StarSystemGenerator,
  ],
  controllers: [StarSystemController],
})
export class StarSystemModule {}
