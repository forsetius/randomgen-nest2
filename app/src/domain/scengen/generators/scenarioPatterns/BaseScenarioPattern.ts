import { SettingService } from '@domain/scengen/services/SettingService';
import { SceneFactory } from '@domain/scengen/services/SceneFactory';
import { SceneSet } from '@domain/scengen/domain/SceneSet';
import { Scenario, Scene } from '@domain/scengen/domain';
import { PickerService } from '@domain/scengen/services/PickerService';

export abstract class BaseScenarioPattern {
  public constructor(
    protected readonly pickerService: PickerService,
    protected readonly settingService: SettingService,
    protected readonly sceneFactory: SceneFactory,
  ) {}

  public abstract generate(params: object): Scenario;

  /**
   * Creates a set of sets of scenes.
   *
   * "From" scene leads to the "start" of each set, and the "finish" of each set leads to "to".
   * As a result, the "from" scene branches out into several parallel sets. if "to" scene is provided,
   * it's "exclusive OR" scenario and only one of the sets can be played. If no "to" scene is provided,
   * the "from" scene is used as the "to" scene of each set, making it possible to play out all the
   * sets in any order.
   *
   * @param sets The sets to be connected.
   * @param from The scene from which the set should start.
   * @param to The scene to which the set should end.
   */
  public parallelize(sets: SceneSet[], from: Scene, to?: Scene): SceneSet {
    to ??= from;
    const set = new SceneSet();
    set.start = from;
    set.finish = to;

    sets.forEach((subset: SceneSet) => {
      set.addSet(from, subset);
      set.addEdge(subset.finish!, to);
    });

    return set;
  }
}
