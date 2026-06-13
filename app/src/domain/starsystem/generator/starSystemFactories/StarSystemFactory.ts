import { StarSystem } from '../../domain/StarSystem';
import { SystemFactory } from '../SystemFactory';

export abstract class StarSystemFactory {
  public constructor(protected readonly systemFactory: SystemFactory) {}

  public abstract createStarSystem(): StarSystem;
}
