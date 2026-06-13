import { StarSystemData } from '../types/domain/StarSystemData';

export interface StarSystemResponseDto {
  innerSystem: StarSystemData;
  outerSystem?: StarSystemData;
}
