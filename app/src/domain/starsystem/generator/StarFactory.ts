import { Star } from '../domain/Star';
import { Mass } from '../domain/valueObjects';
import { Injectable } from '@nestjs/common';

export interface StarSeed {
  readonly mass: Mass;
}

@Injectable()
export class StarFactory {
  public createStar(seed: Readonly<StarSeed>): Star {
    return new Star(seed.mass);
  }
}
