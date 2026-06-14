import { Injectable } from '@nestjs/common';
import type { StarHierarchyNode } from '../domain/stellarHierarchy';
import type {
  BarycenterData,
  BodyData,
  OrbitData,
  StarData,
  StarSystemData,
} from '../types';
import { rollBetween } from '../util/rollBetween';
import {
  formatAlphabeticOrdinal,
  formatHierarchyBarycenterName,
  normalizeHierarchyPath,
} from '../util/canonicalBodyNaming';
import {
  calculateApoapsisDistanceAu,
  calculateOrbitalPeriodDays,
  calculatePeriapsisDistanceAu,
  createLengthFromAstronomicalUnits,
  createPeriodFromDays,
  estimateStarLuminosityFromMass,
  normalizeAngleDegrees,
  randomAngleDegrees,
} from '../util/orbitalMath';
import { Mass } from '../domain/valueObjects';

const DEFAULT_REFERENCE_EPOCH = 'J2000';
const DEFAULT_LENGTH_UNIT = 'au';
const DEFAULT_ANGLE_UNIT = 'deg';
const DEFAULT_TIME_UNIT = 'day';
const CLOSE_BINARY_MINIMUM_SEMI_MAJOR_AXIS_AU = 0.05;
const CLOSE_BINARY_MAXIMUM_SEMI_MAJOR_AXIS_AU = 5;
const WIDE_BINARY_MINIMUM_SEMI_MAJOR_AXIS_AU = 30;
const WIDE_BINARY_MAXIMUM_SEMI_MAJOR_AXIS_AU = 3000;
const WIDE_BINARY_HIERARCHY_RATIO = 8;
const CLOSE_BINARY_MAXIMUM_ECCENTRICITY = 0.35;
const WIDE_BINARY_MAXIMUM_ECCENTRICITY = 0.65;

type OrbitingRootBodyData = StarData | BarycenterData;

interface BuildNodeResult {
  rootBodyId: string;
  rootBody: OrbitingRootBodyData;
  bodies: BodyData[];
  orbits: OrbitData[];
  record: StellarNodeRecord;
  nextStarOrdinal: number;
}

export interface BinaryRelativeOrbit {
  semiMajorAxisAu: number;
  eccentricity: number;
  periapsisDistanceAu: number;
  apoapsisDistanceAu: number;
}

export interface StellarNodeRecord {
  path: string;
  kind: 'single' | 'binary';
  rootBodyId: string;
  rootBody: OrbitingRootBodyData;
  mass: Mass;
  starIds: readonly string[];
  primary?: StellarNodeRecord;
  secondary?: StellarNodeRecord;
  relativeOrbit?: BinaryRelativeOrbit;
}

export interface StellarOrbitGenerationResult {
  starSystemData: StarSystemData;
  rootRecord: StellarNodeRecord;
}

@Injectable()
export class StellarOrbitGenerator {
  public generate(root: StarHierarchyNode): StellarOrbitGenerationResult {
    const buildResult = this.buildNode(root, 'root', 1);

    return {
      starSystemData: {
        rootBodyId: buildResult.rootBodyId,
        referenceEpoch: DEFAULT_REFERENCE_EPOCH,
        defaultLengthUnit: DEFAULT_LENGTH_UNIT,
        defaultAngleUnit: DEFAULT_ANGLE_UNIT,
        defaultTimeUnit: DEFAULT_TIME_UNIT,
        bodyIds: buildResult.bodies.map((body) => body.id),
        bodies: buildResult.bodies,
        orbitIds: buildResult.orbits.map((orbit) => orbit.id),
        orbits: buildResult.orbits,
        coOrbitalGroupIds: [],
        coOrbitalGroups: [],
      },
      rootRecord: buildResult.record,
    };
  }

  private buildNode(
    node: StarHierarchyNode,
    path: string,
    nextStarOrdinal: number,
  ): BuildNodeResult {
    if (node.kind === 'single') {
      const starSuffix = formatAlphabeticOrdinal(nextStarOrdinal);
      const starId = `body-${normalizeHierarchyPath(path)}-star-${starSuffix.toLowerCase()}`;
      const starData: StarData = {
        id: starId,
        type: 'star',
        name: `Star ${starSuffix}`,
        mass: node.star.mass,
        luminosity: estimateStarLuminosityFromMass(
          node.star.mass.getAsSunMass(),
        ),
      };

      return {
        rootBodyId: starId,
        rootBody: starData,
        bodies: [starData],
        orbits: [],
        record: {
          path,
          kind: 'single',
          rootBodyId: starId,
          rootBody: starData,
          mass: node.mass,
          starIds: [starId],
        },
        nextStarOrdinal: nextStarOrdinal + 1,
      };
    }

    const primaryResult = this.buildNode(
      node.primary,
      `${path}.primary`,
      nextStarOrdinal,
    );
    const secondaryResult = this.buildNode(
      node.secondary,
      `${path}.secondary`,
      primaryResult.nextStarOrdinal,
    );
    const barycenterId = `body-${normalizeHierarchyPath(path)}-barycenter`;
    const barycenterData: BarycenterData = {
      id: barycenterId,
      type: 'barycenter',
      name: `${formatHierarchyBarycenterName(path)} barycenter`,
      memberBodyIds: [primaryResult.rootBodyId, secondaryResult.rootBodyId],
      computedMass: node.mass,
    };
    const relativeSemiMajorAxisAu = this.rollRelativeSemiMajorAxisAu(
      node.separation,
      primaryResult.record,
      secondaryResult.record,
    );
    const eccentricity = this.rollEccentricity(node.separation);
    const totalMassInSolarMasses = node.mass.getAsSunMass();
    const primaryMassFraction =
      primaryResult.record.mass.getAsSunMass() / totalMassInSolarMasses;
    const secondaryMassFraction =
      secondaryResult.record.mass.getAsSunMass() / totalMassInSolarMasses;
    const primarySemiMajorAxisAu =
      relativeSemiMajorAxisAu * secondaryMassFraction;
    const secondarySemiMajorAxisAu =
      relativeSemiMajorAxisAu * primaryMassFraction;
    const siderealPeriod = createPeriodFromDays(
      calculateOrbitalPeriodDays(
        relativeSemiMajorAxisAu,
        totalMassInSolarMasses,
      ),
    );
    const argumentOfPeriapsis = randomAngleDegrees();
    const meanAnomalyAtEpoch = randomAngleDegrees();
    const primaryOrbitId = `orbit-${normalizeHierarchyPath(path)}-primary`;
    const secondaryOrbitId = `orbit-${normalizeHierarchyPath(path)}-secondary`;

    primaryResult.rootBody.orbitId = primaryOrbitId;
    secondaryResult.rootBody.orbitId = secondaryOrbitId;

    const primaryOrbit = this.createOrbitData(
      primaryOrbitId,
      barycenterId,
      primaryResult.rootBodyId,
      primarySemiMajorAxisAu,
      eccentricity,
      siderealPeriod,
      argumentOfPeriapsis,
      meanAnomalyAtEpoch,
    );
    const secondaryOrbit = this.createOrbitData(
      secondaryOrbitId,
      barycenterId,
      secondaryResult.rootBodyId,
      secondarySemiMajorAxisAu,
      eccentricity,
      siderealPeriod,
      argumentOfPeriapsis,
      normalizeAngleDegrees(meanAnomalyAtEpoch + 180),
    );

    return {
      rootBodyId: barycenterId,
      rootBody: barycenterData,
      bodies: [
        barycenterData,
        ...primaryResult.bodies,
        ...secondaryResult.bodies,
      ],
      orbits: [
        ...primaryResult.orbits,
        ...secondaryResult.orbits,
        primaryOrbit,
        secondaryOrbit,
      ],
      record: {
        path,
        kind: 'binary',
        rootBodyId: barycenterId,
        rootBody: barycenterData,
        mass: node.mass,
        starIds: [
          ...primaryResult.record.starIds,
          ...secondaryResult.record.starIds,
        ],
        primary: primaryResult.record,
        secondary: secondaryResult.record,
        relativeOrbit: {
          semiMajorAxisAu: relativeSemiMajorAxisAu,
          eccentricity,
          periapsisDistanceAu: calculatePeriapsisDistanceAu(
            relativeSemiMajorAxisAu,
            eccentricity,
          ),
          apoapsisDistanceAu: calculateApoapsisDistanceAu(
            relativeSemiMajorAxisAu,
            eccentricity,
          ),
        },
      },
      nextStarOrdinal: secondaryResult.nextStarOrdinal,
    };
  }

  private rollRelativeSemiMajorAxisAu(
    separation: 'close' | 'wide',
    primaryRecord: StellarNodeRecord,
    secondaryRecord: StellarNodeRecord,
  ): number {
    if (separation === 'close') {
      return rollBetween(
        CLOSE_BINARY_MINIMUM_SEMI_MAJOR_AXIS_AU,
        CLOSE_BINARY_MAXIMUM_SEMI_MAJOR_AXIS_AU,
      );
    }

    const minimumWideSemiMajorAxisAu = Math.max(
      WIDE_BINARY_MINIMUM_SEMI_MAJOR_AXIS_AU,
      Math.max(
        this.getNestedApoapsisDistanceAu(primaryRecord),
        this.getNestedApoapsisDistanceAu(secondaryRecord),
      ) * WIDE_BINARY_HIERARCHY_RATIO,
    );
    const maximumWideSemiMajorAxisAu = Math.max(
      WIDE_BINARY_MAXIMUM_SEMI_MAJOR_AXIS_AU,
      minimumWideSemiMajorAxisAu * 25,
    );

    return rollBetween(minimumWideSemiMajorAxisAu, maximumWideSemiMajorAxisAu);
  }

  private rollEccentricity(separation: 'close' | 'wide'): number {
    return rollBetween(
      0.01,
      separation === 'close'
        ? CLOSE_BINARY_MAXIMUM_ECCENTRICITY
        : WIDE_BINARY_MAXIMUM_ECCENTRICITY,
      {
        strategy: 'power-law',
        exponent: 1.6,
      },
    );
  }

  private getNestedApoapsisDistanceAu(record: StellarNodeRecord): number {
    return record.relativeOrbit?.apoapsisDistanceAu ?? 0;
  }

  private createOrbitData(
    orbitId: string,
    primaryBodyId: string,
    orbitingBodyId: string,
    semiMajorAxisAu: number,
    eccentricity: number,
    siderealPeriod: ReturnType<typeof createPeriodFromDays>,
    argumentOfPeriapsis: number,
    meanAnomalyAtEpoch: number,
  ): OrbitData {
    return {
      id: orbitId,
      primaryBodyId,
      orbitingBodyId,
      kind: 'keplerian',
      frame: 'barycentric',
      epoch: DEFAULT_REFERENCE_EPOCH,
      semiMajorAxis: createLengthFromAstronomicalUnits(semiMajorAxisAu),
      eccentricity,
      inclination: 0,
      longitudeOfAscendingNode: 0,
      argumentOfPeriapsis,
      meanAnomalyAtEpoch,
      siderealPeriod,
      periapsisDistance: createLengthFromAstronomicalUnits(
        calculatePeriapsisDistanceAu(semiMajorAxisAu, eccentricity),
      ),
      apoapsisDistance: createLengthFromAstronomicalUnits(
        calculateApoapsisDistanceAu(semiMajorAxisAu, eccentricity),
      ),
    };
  }
}
