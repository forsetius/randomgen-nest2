import { Star } from '../domain/Star';
import { StarSystem } from '../domain/StarSystem';
import { AstrometryGenerateSystemQueryDto } from '../dto/AstrometryGenerateSystemQueryDto';
import { Timeline } from '../domain/Timeline';

export abstract class BaseSystemGenerator {
  protected abstract rollAge(): number;
  protected abstract rollStarCount(): number;
  public abstract create(options: AstrometryGenerateSystemQueryDto): Timeline;

  public constructor() {
    this.options = {
      starCount: optionsDto.starCount ?? this.rollStarCount(),
      age: optionsDto.stage ?? this.rollAge(),
      minRockies: optionsDto.minRockies ?? 0,
      maxRockies: optionsDto.maxRockies ?? 9,
      minGiants: optionsDto.minGiants ?? 0,
      maxGiants: optionsDto.maxGiants ?? 9,
    };
  }

  protected calculateStarTurbulence(starData: StarPlacement[]): number {
    return starData.reduce((acc, { zone }, idx) => acc + idx + zone, 0);
  }
}

export interface StarPlacement {
  star: Star;
  zone: Zone;
}

export enum Zone {
  BARYCENTER,
  FAR,
  MEDIUM,
  NEAR,
}
