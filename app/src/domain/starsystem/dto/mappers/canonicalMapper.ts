import { randomUUID } from 'node:crypto';
import type { StarSystem } from '../../domain/StarSystem';
import type { StarHierarchyNode } from '../../domain/stellarHierarchy';
import type {
  BarycenterData,
  BodyData,
  StarData,
  StarSystemData,
} from '../../types';
import type { StarSystemResponseDto } from '../StarSystemResponseDto';

interface HierarchyMappingResult {
  rootBodyId: string;
  bodies: BodyData[];
  nextStarOrdinal: number;
}

const DEFAULT_REFERENCE_EPOCH = 'J2000';
const DEFAULT_LENGTH_UNIT = 'au';
const DEFAULT_ANGLE_UNIT = 'deg';
const DEFAULT_TIME_UNIT = 'day';

export function canonicalMapper(starSystem: StarSystem): StarSystemResponseDto {
  const responseId = randomUUID();
  const systemName = `Generated star system ${responseId.slice(0, 8)}`;
  const hierarchyData = mapHierarchyNode(starSystem.root, 'root', 1);
  const starSystemData: StarSystemData = {
    rootBodyId: hierarchyData.rootBodyId,
    referenceEpoch: DEFAULT_REFERENCE_EPOCH,
    defaultLengthUnit: DEFAULT_LENGTH_UNIT,
    defaultAngleUnit: DEFAULT_ANGLE_UNIT,
    defaultTimeUnit: DEFAULT_TIME_UNIT,
    bodyIds: hierarchyData.bodies.map((body) => body.id),
    bodies: hierarchyData.bodies,
    orbitIds: [],
    orbits: [],
    coOrbitalGroupIds: [],
    coOrbitalGroups: [],
  };

  return {
    id: responseId,
    name: systemName,
    starSystem: starSystemData,
  };
}

function mapHierarchyNode(
  node: StarHierarchyNode,
  path: string,
  nextStarOrdinal: number,
): HierarchyMappingResult {
  if (node.kind === 'single') {
    const starSuffix = formatAlphabeticOrdinal(nextStarOrdinal);
    const starId = `body-${normalizePath(path)}-star-${starSuffix.toLowerCase()}`;
    const starData: StarData = {
      id: starId,
      type: 'star',
      name: `Star ${starSuffix}`,
      mass: node.star.mass,
    };

    return {
      rootBodyId: starId,
      bodies: [starData],
      nextStarOrdinal: nextStarOrdinal + 1,
    };
  }

  const primaryResult = mapHierarchyNode(
    node.primary,
    `${path}.primary`,
    nextStarOrdinal,
  );
  const secondaryResult = mapHierarchyNode(
    node.secondary,
    `${path}.secondary`,
    primaryResult.nextStarOrdinal,
  );
  const barycenterData: BarycenterData = {
    id: `body-${normalizePath(path)}-barycenter`,
    type: 'barycenter',
    name: `${formatBarycenterName(path)} barycenter`,
    memberBodyIds: [primaryResult.rootBodyId, secondaryResult.rootBodyId],
    computedMass: node.mass,
  };

  return {
    rootBodyId: barycenterData.id,
    bodies: [
      barycenterData,
      ...primaryResult.bodies,
      ...secondaryResult.bodies,
    ],
    nextStarOrdinal: secondaryResult.nextStarOrdinal,
  };
}

function normalizePath(path: string): string {
  return path.replaceAll('.', '-');
}

function formatBarycenterName(path: string): string {
  if (path === 'root') {
    return 'Root';
  }

  return path
    .split('.')
    .map((segment) => {
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
    .join(' ');
}

function formatAlphabeticOrdinal(ordinal: number): string {
  let remaining = ordinal;
  let result = '';

  while (remaining > 0) {
    const zeroBasedOrdinal = (remaining - 1) % 26;
    result = String.fromCharCode(65 + zeroBasedOrdinal) + result;
    remaining = Math.floor((remaining - 1) / 26);
  }

  return result;
}
