import { StarSystemFactory } from './StarSystemFactory';
import { StarSystem } from '../../domain/StarSystem';

export class SingleSystemFactory extends StarSystemFactory {
  public createStarSystem(): StarSystem {
    const system = this.systemFactory.createSystem(1);

    return new StarSystem(system);
  }
}
