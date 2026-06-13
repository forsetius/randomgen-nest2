import { StarSystemFactory } from './StarSystemFactory';
import { StarSystem } from '../../domain/StarSystem';

export class SparseBinarySystemFactory extends StarSystemFactory {
  public createStarSystem(): StarSystem {
    const innerSystem = this.systemFactory.createSystem(1);
    const outerSystem = this.systemFactory.createSystem(1, innerSystem.mass);

    return new StarSystem(innerSystem, outerSystem);
  }
}
