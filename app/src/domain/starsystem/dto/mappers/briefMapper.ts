import { randomUUID } from 'node:crypto';
import type {
  SingleStarNodeContract,
  StarHierarchyNode,
} from '../../domain/stellarHierarchy';
import type { StarSystem } from '../../domain/StarSystem';
import type { BodyData, OrbitData, PlanetData } from '../../types';
import {
  formatAlphabeticOrdinal,
  normalizeHierarchyPath,
} from '../../util/canonicalBodyNaming';
import { estimateStarLuminosityFromMass } from '../../util/orbitalMath';
import type {
  BriefPlanetData,
  BriefStarData,
  BriefStarSystemResponseDto,
  BriefSystemData,
  BriefTopology,
} from '../BriefStarSystemResponseDto';

interface MappingContext {
  bodyById: Map<string, BodyData>;
  orbitById: Map<string, OrbitData>;
}

interface StarMappingResult {
  star: BriefStarData;
  nextStarOrdinal: number;
  hostBodyIds: string[];
}

interface SystemMappingResult {
  system: BriefSystemData;
  nextStarOrdinal: number;
  hostBodyIds: string[];
}

export function briefMapper(
  starSystem: StarSystem,
): BriefStarSystemResponseDto {
  const mappingContext = createMappingContext(starSystem);
  const systems = mapSystems(starSystem.root, mappingContext);

  return {
    id: randomUUID(),
    topology: describeSupportedTopology(starSystem.root),
    systems: systems.map((system) => system.system),
  };
}

function createMappingContext(starSystem: StarSystem): MappingContext {
  return {
    bodyById: new Map(
      (starSystem.data?.bodies ?? []).map((body) => [body.id, body]),
    ),
    orbitById: new Map(
      (starSystem.data?.orbits ?? []).map((orbit) => [orbit.id, orbit]),
    ),
  };
}

function mapSystems(
  root: StarHierarchyNode,
  context: MappingContext,
): SystemMappingResult[] {
  if (root.kind === 'single' || root.separation === 'close') {
    return [mapSystemNode(root, 'root', 1, 'system', context)];
  }

  const innerSystem = mapSystemNode(
    root.primary,
    'root.primary',
    1,
    'inner system',
    context,
  );
  const outerSystem = mapSystemNode(
    root.secondary,
    'root.secondary',
    innerSystem.nextStarOrdinal,
    'outer system',
    context,
  );

  return [innerSystem, outerSystem];
}

function mapSystemNode(
  node: StarHierarchyNode,
  path: string,
  nextStarOrdinal: number,
  systemName: BriefSystemData['name'],
  context: MappingContext,
): SystemMappingResult {
  if (node.kind === 'single') {
    const starMapping = mapSingleStarNode(
      node,
      path,
      nextStarOrdinal,
      'sole',
      context,
    );

    return {
      system: {
        name: systemName,
        stars: [starMapping.star],
        planets: mapPlanetsForSystemHosts(starMapping.hostBodyIds, context),
      },
      nextStarOrdinal: starMapping.nextStarOrdinal,
      hostBodyIds: starMapping.hostBodyIds,
    };
  }

  if (node.separation === 'wide') {
    throw new Error(
      `Brief mapper does not support nested wide subsystems at ${path}`,
    );
  }

  const primaryStar = mapLeafStarNode(
    node.primary,
    `${path}.primary`,
    nextStarOrdinal,
    'primary',
    context,
  );
  const secondaryStar = mapLeafStarNode(
    node.secondary,
    `${path}.secondary`,
    primaryStar.nextStarOrdinal,
    'secondary',
    context,
  );
  const barycenterId = `body-${normalizeHierarchyPath(path)}-barycenter`;
  const hostBodyIds = [
    barycenterId,
    ...primaryStar.hostBodyIds,
    ...secondaryStar.hostBodyIds,
  ];

  return {
    system: {
      name: systemName,
      stars: [primaryStar.star, secondaryStar.star],
      planets: mapPlanetsForSystemHosts(hostBodyIds, context),
    },
    nextStarOrdinal: secondaryStar.nextStarOrdinal,
    hostBodyIds,
  };
}

function mapLeafStarNode(
  node: StarHierarchyNode,
  path: string,
  nextStarOrdinal: number,
  positionInSystem: BriefStarData['positionInSystem'],
  context: MappingContext,
): StarMappingResult {
  if (node.kind !== 'single') {
    throw new Error(`Expected a leaf star node at ${path}`);
  }

  return mapSingleStarNode(
    node,
    path,
    nextStarOrdinal,
    positionInSystem,
    context,
  );
}

function mapSingleStarNode(
  node: SingleStarNodeContract,
  path: string,
  nextStarOrdinal: number,
  positionInSystem: BriefStarData['positionInSystem'],
  context: MappingContext,
): StarMappingResult {
  const starSuffix = formatAlphabeticOrdinal(nextStarOrdinal);
  const starId = `body-${normalizeHierarchyPath(path)}-star-${starSuffix.toLowerCase()}`;
  const starBody = context.bodyById.get(starId);
  const starName =
    starBody?.type === 'star' ? starBody.name : `Star ${starSuffix}`;
  const luminosityValue =
    starBody?.type === 'star' && starBody.luminosity != null
      ? starBody.luminosity
      : estimateStarLuminosityFromMass(node.star.mass.getAsSunMass());

  return {
    star: {
      id: starId,
      name: starName,
      positionInSystem,
      stellarClass:
        starBody?.type === 'star'
          ? (starBody.stellarType ?? starBody.spectralClass ?? 'unknown')
          : 'unknown',
      mass: formatNumberWithUnit(node.star.mass.getAsSunMass(), 'M☉'),
      luminosity: formatNumberWithUnit(luminosityValue, 'L☉'),
    },
    nextStarOrdinal: nextStarOrdinal + 1,
    hostBodyIds: [starId],
  };
}

function mapPlanetsForSystemHosts(
  hostBodyIds: readonly string[],
  context: MappingContext,
): BriefPlanetData[] {
  const hostBodyIdSet = new Set(hostBodyIds);
  const mappedPlanets = [...context.bodyById.values()]
    .filter((body): body is PlanetData => body.type === 'planet')
    .map((planet) => {
      if (planet.orbitId == null) {
        return undefined;
      }

      const orbit = context.orbitById.get(planet.orbitId);

      if (orbit == null || !hostBodyIdSet.has(orbit.primaryBodyId)) {
        return undefined;
      }

      return {
        planet,
        orbit,
      };
    })
    .filter((entry): entry is { planet: PlanetData; orbit: OrbitData } => {
      return entry != null;
    })
    .sort((left, right) => {
      return (
        (left.orbit.semiMajorAxis?.getAsAU() ?? Number.POSITIVE_INFINITY) -
        (right.orbit.semiMajorAxis?.getAsAU() ?? Number.POSITIVE_INFINITY)
      );
    });

  return mappedPlanets.map(({ planet, orbit }) => {
    const hostBody = context.bodyById.get(orbit.primaryBodyId);
    const isGasPlanet =
      planet.compositionClass === 'gas' || planet.surfaceClass === 'cloudTop';

    return {
      id: planet.id,
      name: planet.name,
      hostBody: hostBody?.name ?? orbit.primaryBodyId,
      ...(orbit.semiMajorAxis == null
        ? {}
        : {
            semiMajorAxis: formatNumberWithUnit(
              orbit.semiMajorAxis.getAsAU(),
              'AU',
            ),
          }),
      ...(planet.mass == null
        ? {}
        : {
            mass: formatNumberWithUnit(
              isGasPlanet
                ? planet.mass.getAsJupiterMass()
                : planet.mass.getAsEarthMass(),
              isGasPlanet ? 'M♃' : 'M🜨',
            ),
          }),
      ...(planet.shape?.meanRadius == null
        ? {}
        : {
            meanRadius: formatNumberWithUnit(
              isGasPlanet
                ? planet.shape.meanRadius.getAsJupiterRadii()
                : planet.shape.meanRadius.getAsEarthRadii(),
              isGasPlanet ? 'R♃' : 'R🜨',
            ),
          }),
      ...(planet.surfaceGravity == null
        ? {}
        : {
            gravity: formatNumberWithUnit(
              planet.surfaceGravity.getAsEarthG(),
              'g🜨',
            ),
          }),
      ...(planet.surfaceClass == null
        ? {}
        : {
            surfaceClass: planet.surfaceClass,
          }),
    };
  });
}

function describeSupportedTopology(root: StarHierarchyNode): BriefTopology {
  if (root.kind === 'single') {
    return 'single';
  }

  if (root.separation === 'close') {
    return 'close binary';
  }

  if (root.primary.kind === 'single' && root.secondary.kind === 'single') {
    return 'wide binary';
  }

  if (root.primary.kind === 'binary' && root.secondary.kind === 'single') {
    return 'ternary (close binary + single)';
  }

  if (root.primary.kind === 'single' && root.secondary.kind === 'binary') {
    return 'ternary (single + close binary)';
  }

  throw new Error('Unsupported star-system topology for brief mapper');
}

function formatNumberWithUnit(value: number, unit: string): string {
  return `${value.toFixed(2)} ${unit}`;
}
