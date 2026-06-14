import { Injectable } from '@nestjs/common';
import { Mass } from '../domain/valueObjects';
import type { OrbitClass } from '../types';
import { normalizeHierarchyPath } from '../util/canonicalBodyNaming';
import {
  clampNumber,
  computePTypeCriticalSemiMajorAxis,
  computeSTypeCriticalSemiMajorAxis,
  estimateStarLuminosityFromMass,
} from '../util/orbitalMath';
import type {
  StellarNodeRecord,
  StellarOrbitGenerationResult,
} from './StellarOrbitGenerator';

const MINIMUM_HOST_ZONE_SPAN_RATIO = 1.2;

export interface PlanetaryHostZone {
  id: string;
  hostBodyId: string;
  hostBodyType: 'star' | 'barycenter';
  orbitClass: OrbitClass;
  hostName: string;
  hostMass: Mass;
  innerBoundaryAu: number;
  outerBoundaryAu: number;
  parentStarIds: readonly string[];
}

@Injectable()
export class OrbitalZoneDeriver {
  public derive(
    stellarOrbitGenerationResult: StellarOrbitGenerationResult,
  ): readonly PlanetaryHostZone[] {
    return this.collectHostZones(
      stellarOrbitGenerationResult.rootRecord,
    ).filter((hostZone) => this.isViableHostZone(hostZone));
  }

  private collectHostZones(record: StellarNodeRecord): PlanetaryHostZone[] {
    if (record.kind === 'single') {
      return [this.createCircumstellarHostZone(record)];
    }

    const primaryRecord = record.primary;
    const secondaryRecord = record.secondary;

    if (primaryRecord == null || secondaryRecord == null) {
      throw new Error(
        `Binary stellar node ${record.path} is missing a child record`,
      );
    }

    const primaryHostZones = this.applyCompanionOuterBoundary(
      this.collectHostZones(primaryRecord),
      primaryRecord.rootBodyId,
      record.relativeOrbit?.semiMajorAxisAu ?? 0,
      record.relativeOrbit?.eccentricity ?? 0,
      secondaryRecord.mass.getAsSunMass() / record.mass.getAsSunMass(),
    );
    const secondaryHostZones = this.applyCompanionOuterBoundary(
      this.collectHostZones(secondaryRecord),
      secondaryRecord.rootBodyId,
      record.relativeOrbit?.semiMajorAxisAu ?? 0,
      record.relativeOrbit?.eccentricity ?? 0,
      primaryRecord.mass.getAsSunMass() / record.mass.getAsSunMass(),
    );
    const circumbinaryHostZones =
      record.starIds.length === 2
        ? [this.createCircumbinaryHostZone(record)]
        : [];

    return [
      ...primaryHostZones,
      ...secondaryHostZones,
      ...circumbinaryHostZones,
    ];
  }

  private createCircumstellarHostZone(
    record: StellarNodeRecord,
  ): PlanetaryHostZone {
    const stellarMassInSolarMasses = record.mass.getAsSunMass();
    const stellarLuminosity = estimateStarLuminosityFromMass(
      stellarMassInSolarMasses,
    );
    const innerBoundaryAu = Math.max(
      0.05,
      0.08 * Math.sqrt(Math.max(stellarLuminosity, 0.01)),
    );
    const outerBoundaryAu = Math.max(
      innerBoundaryAu * MINIMUM_HOST_ZONE_SPAN_RATIO,
      Math.min(120, Math.max(4, 40 * Math.sqrt(stellarMassInSolarMasses))),
    );

    return {
      id: `host-zone-${normalizeHierarchyPath(record.path)}-circumstellar`,
      hostBodyId: record.rootBodyId,
      hostBodyType: 'star',
      orbitClass: 'circumstellar',
      hostName: record.rootBody.name,
      hostMass: record.mass,
      innerBoundaryAu,
      outerBoundaryAu,
      parentStarIds: [record.rootBodyId],
    };
  }

  private createCircumbinaryHostZone(
    record: StellarNodeRecord,
  ): PlanetaryHostZone {
    const relativeOrbit = record.relativeOrbit;

    if (relativeOrbit == null) {
      throw new Error(
        `Binary stellar node ${record.path} is missing a relative orbit`,
      );
    }

    const primaryMassFraction =
      record.secondary?.mass.getAsSunMass() == null
        ? 0.5
        : record.secondary.mass.getAsSunMass() / record.mass.getAsSunMass();
    const innerBoundaryAu = computePTypeCriticalSemiMajorAxis(
      relativeOrbit.semiMajorAxisAu,
      relativeOrbit.eccentricity,
      primaryMassFraction,
    );
    const outerBoundaryAu = Math.max(
      innerBoundaryAu * MINIMUM_HOST_ZONE_SPAN_RATIO,
      Math.min(180, Math.max(8, 32 * Math.sqrt(record.mass.getAsSunMass()))),
    );

    return {
      id: `host-zone-${normalizeHierarchyPath(record.path)}-circumbinary`,
      hostBodyId: record.rootBodyId,
      hostBodyType: 'barycenter',
      orbitClass: 'circumbinary',
      hostName: record.rootBody.name,
      hostMass: record.mass,
      innerBoundaryAu,
      outerBoundaryAu,
      parentStarIds: record.starIds,
    };
  }

  private applyCompanionOuterBoundary(
    hostZones: readonly PlanetaryHostZone[],
    constrainedHostBodyId: string,
    binarySemiMajorAxisAu: number,
    eccentricity: number,
    companionMassFraction: number,
  ): PlanetaryHostZone[] {
    const criticalSemiMajorAxisAu = computeSTypeCriticalSemiMajorAxis(
      binarySemiMajorAxisAu,
      eccentricity,
      companionMassFraction,
    );

    return hostZones.map((hostZone) => {
      if (hostZone.hostBodyId !== constrainedHostBodyId) {
        return hostZone;
      }

      return {
        ...hostZone,
        outerBoundaryAu: clampNumber(
          criticalSemiMajorAxisAu,
          hostZone.innerBoundaryAu,
          hostZone.outerBoundaryAu,
        ),
      };
    });
  }

  private isViableHostZone(hostZone: PlanetaryHostZone): boolean {
    return (
      Number.isFinite(hostZone.innerBoundaryAu) &&
      Number.isFinite(hostZone.outerBoundaryAu) &&
      hostZone.innerBoundaryAu > 0 &&
      hostZone.outerBoundaryAu >
        hostZone.innerBoundaryAu * MINIMUM_HOST_ZONE_SPAN_RATIO
    );
  }
}
