import type {
  Acceleration,
  Length,
  Mass,
  Period,
  Velocity,
} from '../domain/valueObjects';

export type BodyType =
  | 'barycenter'
  | 'star'
  | 'planet'
  | 'dwarfPlanet'
  | 'moon'
  | 'ringSystem'
  | 'asteroidBelt'
  | 'minorBody';

export type CoOrbitalRole =
  | 'primary'
  | 'trojanLeading'
  | 'trojanTrailing'
  | 'l3'
  | 'l4'
  | 'l5'
  | 'horseshoe'
  | 'quasiSatellite'
  | 'coOrbitalOther';

export type OrbitKind = 'keplerian';
export type OrbitFrame = 'barycentric' | 'bodycentric';
export type OrbitClass =
  | 'circumstellar'
  | 'circumbinary'
  | 'satellite'
  | 'ring'
  | 'belt';
export type StabilityClass = 'stable' | 'marginal' | 'unknown';
export type CompositionClass = 'rocky' | 'icy' | 'metallic' | 'gas' | 'mixed';
export type BreathabilityClass =
  | 'breathable'
  | 'unbreathable'
  | 'toxic'
  | 'unknown';
export type SurfaceClass =
  | 'desert'
  | 'ocean'
  | 'ice'
  | 'lava'
  | 'airless'
  | 'cloudTop';
export type MinorBodyClass =
  | 'asteroid'
  | 'comet'
  | 'trojan'
  | 'centaur'
  | 'transNeptunianObject';
export type RingPlaneSource = 'equatorial' | 'custom';
export type DistributionProfile =
  | 'uniform'
  | 'clustered'
  | 'resonantGapsPresent';
export type CoOrbitalPattern =
  | 'trojan'
  | 'horseshoe'
  | 'quasiSatellite'
  | 'librationCluster';

export interface ShapeData {
  meanRadius?: Length;
  equatorialRadius?: Length;
  polarRadius?: Length;
}

export interface PoleOrientationData {
  rightAscension: number;
  declination: number;
  epoch: string;
}

export interface AtmosphereData {
  present: boolean;
  pressure?: number;
  composition?: string[];
  breathability?: BreathabilityClass;
}

export interface HydrosphereData {
  surfaceLiquidFraction?: number;
  surfaceIceFraction?: number;
}

export interface CommonBodyData {
  id: string;
  type: BodyType;
  name: string;
  displayName?: string;
}

export interface PhysicalBodyData extends CommonBodyData {
  orbitId?: string;
  mass?: Mass;
  shape?: ShapeData;
  siderealRotationPeriod?: Period;
  axialTilt?: number;
  poleOrientation?: PoleOrientationData;
  primeMeridianAngleAtEpoch?: number;
  albedo?: number;
  coOrbitalGroupId?: string;
  coOrbitalRole?: CoOrbitalRole;
  visualClass?: string;
}

export interface BarycenterData extends CommonBodyData {
  type: 'barycenter';
  orbitId?: string;
  memberBodyIds: string[];
  computedMass: Mass;
}

export interface StarData extends PhysicalBodyData {
  type: 'star';
  mass: Mass;
  stellarType?: string;
  spectralClass?: string;
  luminosityClass?: string;
  luminosity?: number;
  effectiveTemperature?: number;
  metallicity?: number;
  age?: number;
  isVariable?: boolean;
  colorIndex?: number;
  absoluteMagnitude?: number;
}

export interface PlanetLikeBodyData extends PhysicalBodyData {
  compositionClass?: CompositionClass;
  surfaceGravity?: Acceleration;
  density?: number;
  escapeVelocity?: Velocity;
  equilibriumTemperature?: number;
  surfaceTemperature?: number;
  surfaceClass?: SurfaceClass;
  parentStarIds?: string[];
  atmosphere?: AtmosphereData;
  hydrosphere?: HydrosphereData;
}

export interface PlanetData extends PlanetLikeBodyData {
  type: 'planet';
}

export interface DwarfPlanetData extends PlanetLikeBodyData {
  type: 'dwarfPlanet';
}

export interface MoonData extends PlanetLikeBodyData {
  type: 'moon';
}

export interface MinorBodyData extends PlanetLikeBodyData {
  type: 'minorBody';
  minorBodyClass?: MinorBodyClass;
  absoluteMagnitude?: number;
  colorClass?: string;
}

export interface RingSystemData extends CommonBodyData {
  type: 'ringSystem';
  hostBodyId: string;
  innerRadius?: Length;
  outerRadius?: Length;
  thickness?: Length;
  ringPlaneSource?: RingPlaneSource;
  opticalDepth?: number;
  compositionClass?: CompositionClass;
  textureHint?: string;
  color?: string;
}

export interface AsteroidBeltData extends CommonBodyData {
  type: 'asteroidBelt';
  hostBodyId: string;
  innerRadius?: Length;
  outerRadius?: Length;
  meanRadius?: Length;
  thickness?: Length;
  estimatedTotalMass?: Mass;
  dominantCompositionClass?: CompositionClass;
  estimatedObjectCount?: number;
  containsSelectedMinorBodies?: boolean;
  distributionProfile?: DistributionProfile;
}

export type BodyData =
  | BarycenterData
  | StarData
  | PlanetData
  | DwarfPlanetData
  | MoonData
  | RingSystemData
  | AsteroidBeltData
  | MinorBodyData;

export interface OrbitData {
  id: string;
  primaryBodyId: string;
  orbitingBodyId: string;
  kind: OrbitKind;
  frame: OrbitFrame;
  epoch: string;
  semiMajorAxis?: Length;
  eccentricity?: number;
  inclination?: number;
  longitudeOfAscendingNode?: number;
  argumentOfPeriapsis?: number;
  meanAnomalyAtEpoch?: number;
  siderealPeriod?: Period;
  periapsisDistance?: Length;
  apoapsisDistance?: Length;
  orbitClass?: OrbitClass;
  stabilityClass?: StabilityClass;
}

export interface CoOrbitalGroupData {
  id: string;
  centralBodyId: string;
  referenceBodyId: string;
  referenceOrbitId: string;
  pattern: CoOrbitalPattern;
  memberBodyIds: string[];
}

export interface StarSystemData {
  rootBodyId: string;
  referenceEpoch: string;
  defaultLengthUnit: 'au';
  defaultAngleUnit: 'deg';
  defaultTimeUnit: 'day';
  bodyIds: string[];
  bodies: BodyData[];
  orbitIds: string[];
  orbits: OrbitData[];
  coOrbitalGroupIds: string[];
  coOrbitalGroups: CoOrbitalGroupData[];
}
