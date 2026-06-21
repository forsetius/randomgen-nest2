import type { SurfaceClass } from '../types';

export type BriefTopology =
  | 'single'
  | 'close binary'
  | 'wide binary'
  | 'ternary (close binary + single)'
  | 'ternary (single + close binary)';

export interface BriefPlanetData {
  id: string;
  name: string;
  hostBody: string;
  semiMajorAxis?: string;
  mass?: string;
  meanRadius?: string;
  gravity?: string;
  surfaceClass?: SurfaceClass;
}

export interface BriefStarData {
  id: string;
  name: string;
  positionInSystem: 'sole' | 'primary' | 'secondary';
  stellarClass: string;
  mass: string;
  luminosity?: string;
}

export interface BriefSystemData {
  name: 'system' | 'inner system' | 'outer system';
  stars: BriefStarData[];
  planets: BriefPlanetData[];
}

export interface BriefStarSystemResponseDto {
  id: string;
  topology: BriefTopology;
  systems: BriefSystemData[];
  starCount: number[];
  planetCount: number[];
}
