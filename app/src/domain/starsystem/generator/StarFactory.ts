import { Star } from '../domain/Star';
import { Mass } from '../domain/valueObjects';

export interface StarSeed {
  readonly mass: Mass;
}

export class StarFactory {
  public createStar(seed: Readonly<StarSeed>): Star {
    return new Star(seed.mass);
  }
}
