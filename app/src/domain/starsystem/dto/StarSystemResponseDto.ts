import { Mass } from '../domain/valueObjects';

export interface StarDto {
  mass: Mass;
}

export interface SingleStarNodeDto {
  kind: 'single';
  star: StarDto;
}

export interface BinaryStarNodeDto {
  kind: 'binary';
  separation: 'close' | 'wide';
  primary: StarHierarchyNodeDto;
  secondary: StarHierarchyNodeDto;
}

export type StarHierarchyNodeDto = SingleStarNodeDto | BinaryStarNodeDto;

export interface StarSystemResponseDto {
  root: StarHierarchyNodeDto;
}
