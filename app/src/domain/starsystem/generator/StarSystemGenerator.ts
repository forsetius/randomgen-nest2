import { RollableCollection } from '../../../shared/util/collections/RollableCollection';
import { StarSystem } from '../domain/StarSystem';
import { StarLayout, starLayouts } from '../data/starLayouts';
import { SystemFactory } from './SystemFactory';
import { System } from '../domain/System';

export class StarSystemGenerator {
  private starSystemLayouts: RollableCollection<StarLayout>;

  public constructor(private readonly systemFactory: SystemFactory) {
    this.starSystemLayouts = new RollableCollection(starLayouts);
  }

  public generate(): StarSystem {
    const starLayout = this.starSystemLayouts.getRandom();

    const innerSystem = this.systemFactory.createSystem(
      starLayout.innerSystemCount,
    );
    let outerSystem: System | undefined;
    if (starLayout.outerSystemCount > 0) {
      outerSystem = this.systemFactory.createSystem(
        starLayout.outerSystemCount,
        innerSystem.mass,
      );
    }

    return new StarSystem(innerSystem, outerSystem);
  }
}
