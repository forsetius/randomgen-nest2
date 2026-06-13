import { StarSystemFactory } from './StarSystemFactory';
import { StarSystem } from '../../domain/StarSystem';

export class TightBinarySystemFactory extends StarSystemFactory {
  public createStarSystem(): StarSystem {
    const system = this.systemFactory.createSystem(2);

    return new StarSystem(system);
  }
}
