import { Star } from '../domain/Star';

export abstract class StarGenerator {
  public abstract create(): Star;
}
