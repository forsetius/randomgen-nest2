import type { StarSystemData } from '../types';

export interface StarSystemResponseDto {
  id: string;
  name: string;
  starSystem: StarSystemData;
}
