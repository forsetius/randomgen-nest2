import { Injectable } from '@nestjs/common';
import { Acceleration, Length, Mass, Velocity } from '../domain/valueObjects';
import type {
  CompositionClass,
  PlanetData,
  StarSystemData,
  SurfaceClass,
} from '../types';
import { rollBetween } from '../util/rollBetween';
import {
  calculateApoapsisDistanceAu,
  calculateEscapeVelocity,
  calculateOrbitalPeriodDays,
  calculatePeriapsisDistanceAu,
  calculateSurfaceGravity,
  createLengthFromAstronomicalUnits,
  createLengthFromEarthRadii,
  createMassFromEarthMasses,
  createPeriodFromDays,
  normalizeAngleDegrees,
  randomAngleDegrees,
  toRomanNumeral,
} from '../util/orbitalMath';
import type { PlanetaryHostZone } from './OrbitalZoneDeriver';

const DEFAULT_REFERENCE_EPOCH = 'J2000';
const MINIMUM_ZONE_SPAN_RATIO = 1.2;
const MAXIMUM_PLANETS_PER_HOST = 6;

interface ArchitectureProfile {
  minimumHillSpacing: number;
  maximumHillSpacing: number;
  maximumEccentricity: number;
  minimumPlanetMassInEarthMasses: number;
  maximumPlanetMassInEarthMasses: number;
}

interface GeneratedPlanetSeed {
  semiMajorAxisAu: number;
  eccentricity: number;
  mass: Mass;
  massInEarthMasses: number;
  compositionClass: CompositionClass;
  meanRadius: Length;
  surfaceGravity: Acceleration;
  escapeVelocity: Velocity;
  surfaceClass: SurfaceClass;
}

const ARCHITECTURE_PROFILES: readonly ArchitectureProfile[] = [
  {
    minimumHillSpacing: 10,
    maximumHillSpacing: 14,
    maximumEccentricity: 0.05,
    minimumPlanetMassInEarthMasses: 0.25,
    maximumPlanetMassInEarthMasses: 10,
  },
  {
    minimumHillSpacing: 12,
    maximumHillSpacing: 18,
    maximumEccentricity: 0.08,
    minimumPlanetMassInEarthMasses: 0.4,
    maximumPlanetMassInEarthMasses: 60,
  },
  {
    minimumHillSpacing: 16,
    maximumHillSpacing: 22,
    maximumEccentricity: 0.12,
    minimumPlanetMassInEarthMasses: 5,
    maximumPlanetMassInEarthMasses: 300,
  },
];

@Injectable()
export class PlanetaryOrbitGenerator {
  public generate(
    starSystemData: StarSystemData,
    hostZones: readonly PlanetaryHostZone[],
  ): StarSystemData {
    const bodyIds = [...starSystemData.bodyIds];
    const bodies = [...starSystemData.bodies];
    const orbitIds = [...starSystemData.orbitIds];
    const orbits = [...starSystemData.orbits];

    hostZones.forEach((hostZone) => {
      const generatedPlanetSeeds = this.generatePlanetSeeds(hostZone);

      generatedPlanetSeeds.forEach((planetSeed, index) => {
        const romanOrdinal = toRomanNumeral(index + 1);
        const planetSlug = `${hostZone.hostBodyId.replace(/^body-/, '')}-planet-${romanOrdinal.toLowerCase()}`;
        const planetId = `body-${planetSlug}`;
        const orbitId = `orbit-${planetSlug}`;
        const planetData: PlanetData = {
          id: planetId,
          type: 'planet',
          name: `${hostZone.hostName} ${romanOrdinal}`,
          orbitId,
          mass: planetSeed.mass,
          shape: {
            meanRadius: planetSeed.meanRadius,
          },
          compositionClass: planetSeed.compositionClass,
          surfaceGravity: planetSeed.surfaceGravity,
          escapeVelocity: planetSeed.escapeVelocity,
          surfaceClass: planetSeed.surfaceClass,
          parentStarIds: [...hostZone.parentStarIds],
        };

        bodyIds.push(planetId);
        bodies.push(planetData);
        orbitIds.push(orbitId);
        orbits.push({
          id: orbitId,
          primaryBodyId: hostZone.hostBodyId,
          orbitingBodyId: planetId,
          kind: 'keplerian',
          frame:
            hostZone.hostBodyType === 'barycenter'
              ? 'barycentric'
              : 'bodycentric',
          epoch: DEFAULT_REFERENCE_EPOCH,
          semiMajorAxis: createLengthFromAstronomicalUnits(
            planetSeed.semiMajorAxisAu,
          ),
          eccentricity: planetSeed.eccentricity,
          inclination: 0,
          longitudeOfAscendingNode: 0,
          argumentOfPeriapsis: randomAngleDegrees(),
          meanAnomalyAtEpoch: normalizeAngleDegrees(randomAngleDegrees()),
          siderealPeriod: createPeriodFromDays(
            calculateOrbitalPeriodDays(
              planetSeed.semiMajorAxisAu,
              hostZone.hostMass.getAsSunMass(),
            ),
          ),
          periapsisDistance: createLengthFromAstronomicalUnits(
            calculatePeriapsisDistanceAu(
              planetSeed.semiMajorAxisAu,
              planetSeed.eccentricity,
            ),
          ),
          apoapsisDistance: createLengthFromAstronomicalUnits(
            calculateApoapsisDistanceAu(
              planetSeed.semiMajorAxisAu,
              planetSeed.eccentricity,
            ),
          ),
          orbitClass: hostZone.orbitClass,
          stabilityClass: 'stable',
        });
      });
    });

    return {
      ...starSystemData,
      bodyIds,
      bodies,
      orbitIds,
      orbits,
    };
  }

  private generatePlanetSeeds(
    hostZone: PlanetaryHostZone,
  ): readonly GeneratedPlanetSeed[] {
    if (
      hostZone.outerBoundaryAu <=
      hostZone.innerBoundaryAu * MINIMUM_ZONE_SPAN_RATIO
    ) {
      return [];
    }

    const architectureProfile = this.rollArchitectureProfile();
    const targetPlanetCount = this.determineTargetPlanetCount(
      hostZone,
      architectureProfile,
    );
    const generatedSeeds: GeneratedPlanetSeed[] = [];
    const firstPlanetSeed = this.rollFirstPlanetSeed(
      hostZone,
      architectureProfile,
    );

    if (firstPlanetSeed == null) {
      return [];
    }

    generatedSeeds.push(firstPlanetSeed);

    while (generatedSeeds.length < targetPlanetCount) {
      const previousPlanetSeed = generatedSeeds[generatedSeeds.length - 1];

      if (previousPlanetSeed == null) {
        break;
      }

      const nextPlanetSeed = this.rollNextPlanetSeed(
        hostZone,
        architectureProfile,
        previousPlanetSeed,
      );

      if (nextPlanetSeed == null) {
        break;
      }

      generatedSeeds.push(nextPlanetSeed);
    }

    return generatedSeeds;
  }

  private rollArchitectureProfile(): ArchitectureProfile {
    const profileIndex = Math.min(
      ARCHITECTURE_PROFILES.length - 1,
      Math.floor(Math.random() * ARCHITECTURE_PROFILES.length),
    );

    return ARCHITECTURE_PROFILES[profileIndex] ?? ARCHITECTURE_PROFILES[0]!;
  }

  private determineTargetPlanetCount(
    hostZone: PlanetaryHostZone,
    architectureProfile: ArchitectureProfile,
  ): number {
    const spanRatio = hostZone.outerBoundaryAu / hostZone.innerBoundaryAu;
    const approximateCount =
      Math.floor(Math.log(spanRatio) / Math.log(1.8)) +
      (architectureProfile.maximumHillSpacing <= 14 ? 2 : 1);

    return Math.max(1, Math.min(MAXIMUM_PLANETS_PER_HOST, approximateCount));
  }

  private rollFirstPlanetSeed(
    hostZone: PlanetaryHostZone,
    architectureProfile: ArchitectureProfile,
  ): GeneratedPlanetSeed | undefined {
    const eccentricity = this.rollPlanetaryEccentricity(architectureProfile);
    const minimumSemiMajorAxisAu =
      (hostZone.innerBoundaryAu / (1 - eccentricity)) * 1.02;
    const maximumSemiMajorAxisAu = Math.min(
      hostZone.outerBoundaryAu / (1 + eccentricity),
      minimumSemiMajorAxisAu * 4.5,
    );

    if (maximumSemiMajorAxisAu <= minimumSemiMajorAxisAu) {
      return undefined;
    }

    return this.buildPlanetSeed(
      rollBetween(minimumSemiMajorAxisAu, maximumSemiMajorAxisAu),
      eccentricity,
      this.rollPlanetMassInEarthMasses(architectureProfile),
      hostZone,
    );
  }

  private rollNextPlanetSeed(
    hostZone: PlanetaryHostZone,
    architectureProfile: ArchitectureProfile,
    previousPlanetSeed: GeneratedPlanetSeed,
  ): GeneratedPlanetSeed | undefined {
    const eccentricity = this.rollPlanetaryEccentricity(architectureProfile);
    const candidatePlanetMassInEarthMasses =
      this.rollPlanetMassInEarthMasses(architectureProfile);
    const candidatePlanetSeed = this.buildPlanetSeed(
      previousPlanetSeed.semiMajorAxisAu,
      eccentricity,
      candidatePlanetMassInEarthMasses,
      hostZone,
    );
    const hostMassInSolarMasses = hostZone.hostMass.getAsSunMass();
    const mutualMassRatio = Math.cbrt(
      (previousPlanetSeed.mass.getAsSunMass() +
        candidatePlanetSeed.mass.getAsSunMass()) /
        (3 * hostMassInSolarMasses),
    );
    const desiredHillSpacing = rollBetween(
      architectureProfile.minimumHillSpacing,
      architectureProfile.maximumHillSpacing,
      {
        strategy: 'power-law',
        exponent: 1.2,
      },
    );
    const hillSpacingFactor = (desiredHillSpacing * mutualMassRatio) / 2;

    if (hillSpacingFactor >= 0.95) {
      return undefined;
    }

    const semiMajorAxisRatio =
      (1 + hillSpacingFactor) / (1 - hillSpacingFactor);
    const minimumNonCrossingSemiMajorAxisAu =
      ((previousPlanetSeed.semiMajorAxisAu *
        (1 + previousPlanetSeed.eccentricity)) /
        (1 - eccentricity)) *
      1.03;
    const candidateSemiMajorAxisAu = Math.max(
      previousPlanetSeed.semiMajorAxisAu *
        semiMajorAxisRatio *
        rollBetween(1.01, 1.15, {
          strategy: 'power-law',
          exponent: 1.3,
        }),
      minimumNonCrossingSemiMajorAxisAu,
    );
    const maximumSemiMajorAxisAu =
      hostZone.outerBoundaryAu / (1 + eccentricity);

    if (candidateSemiMajorAxisAu >= maximumSemiMajorAxisAu) {
      return undefined;
    }

    return this.buildPlanetSeed(
      candidateSemiMajorAxisAu,
      eccentricity,
      candidatePlanetMassInEarthMasses,
      hostZone,
    );
  }

  private buildPlanetSeed(
    semiMajorAxisAu: number,
    eccentricity: number,
    massInEarthMasses: number,
    hostZone: PlanetaryHostZone,
  ): GeneratedPlanetSeed {
    const mass = createMassFromEarthMasses(massInEarthMasses);
    const compositionClass = this.estimateCompositionClass(
      massInEarthMasses,
      semiMajorAxisAu,
      hostZone,
    );
    const meanRadius = createLengthFromEarthRadii(
      this.estimatePlanetRadiusInEarthRadii(
        massInEarthMasses,
        compositionClass,
      ),
    );

    return {
      semiMajorAxisAu,
      eccentricity,
      mass,
      massInEarthMasses,
      compositionClass,
      meanRadius,
      surfaceGravity: calculateSurfaceGravity(mass, meanRadius),
      escapeVelocity: calculateEscapeVelocity(mass, meanRadius),
      surfaceClass: this.estimateSurfaceClass(compositionClass),
    };
  }

  private rollPlanetMassInEarthMasses(
    architectureProfile: ArchitectureProfile,
  ): number {
    return rollBetween(
      architectureProfile.minimumPlanetMassInEarthMasses,
      architectureProfile.maximumPlanetMassInEarthMasses,
    );
  }

  private rollPlanetaryEccentricity(
    architectureProfile: ArchitectureProfile,
  ): number {
    return rollBetween(0.01, architectureProfile.maximumEccentricity, {
      strategy: 'power-law',
      exponent: 1.5,
    });
  }

  private estimateCompositionClass(
    massInEarthMasses: number,
    semiMajorAxisAu: number,
    hostZone: PlanetaryHostZone,
  ): CompositionClass {
    const approximateIceLineAu =
      2.7 * Math.sqrt(hostZone.hostMass.getAsSunMass());

    if (massInEarthMasses >= 40) {
      return 'gas';
    }

    if (semiMajorAxisAu >= approximateIceLineAu) {
      return massInEarthMasses >= 5 ? 'mixed' : 'icy';
    }

    return massInEarthMasses >= 8 ? 'mixed' : 'rocky';
  }

  private estimateSurfaceClass(
    compositionClass: CompositionClass,
  ): SurfaceClass {
    switch (compositionClass) {
      case 'gas':
        return 'cloudTop';
      case 'icy':
        return 'ice';
      default:
        return 'airless';
    }
  }

  private estimatePlanetRadiusInEarthRadii(
    massInEarthMasses: number,
    compositionClass: CompositionClass,
  ): number {
    let radiusInEarthRadii: number;

    if (compositionClass === 'gas') {
      radiusInEarthRadii = Math.min(
        11.2,
        5.2 + Math.log10(massInEarthMasses + 1) * 2.3,
      );
    } else if (compositionClass === 'icy') {
      radiusInEarthRadii = 1.2 * Math.pow(massInEarthMasses, 0.27);
    } else if (compositionClass === 'mixed') {
      radiusInEarthRadii = 1.45 * Math.pow(massInEarthMasses, 0.24);
    } else {
      radiusInEarthRadii = Math.pow(massInEarthMasses, 0.27);
    }

    if (!Number.isFinite(radiusInEarthRadii) || radiusInEarthRadii <= 0) {
      return 1;
    }

    return radiusInEarthRadii;
  }
}
