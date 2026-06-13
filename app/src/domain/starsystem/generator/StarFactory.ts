import { Star } from '../domain/Star';

export class StarFactory {
  public createStar(): Star {
    return new Star();
  }
}
