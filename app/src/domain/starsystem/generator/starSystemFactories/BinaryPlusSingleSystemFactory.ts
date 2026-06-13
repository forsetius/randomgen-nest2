import { StarSystem } from '../../domain/StarSystem';
import { StarSystemFactory } from './StarSystemFactory';

export class BinaryPlusSingleSystemFactory extends StarSystemFactory {
  public createStarSystem(): StarSystem {
    const innerSystem = this.systemFactory.createSystem(2);
    const outerSystem = this.systemFactory.createSystem(1, innerSystem.mass);

    return new StarSystem(innerSystem, outerSystem);
  }
}
