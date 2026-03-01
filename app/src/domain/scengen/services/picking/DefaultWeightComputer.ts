import * as Picker from '@domain/scengen/types/PickerTypes';
import { ScenarioProfile } from '@domain/scengen/domain';

export class DefaultWeightComputer implements Picker.WeightComputer {
  public compute(
    entity: Picker.PickableEntity,
    profile: ScenarioProfile,
  ): number {
    if (!Number.isFinite(entity.baseWeight) || entity.baseWeight <= 0) {
      return 0;
    }

    const modifiers = entity.profileModifiers;
    let factor = 1;

    for (const [signalKey, modifier] of modifiers.entries()) {
      if (!Number.isFinite(modifier) || modifier === 0) continue;

      factor += profile.get(signalKey) * modifier;
    }

    const finalWeight = entity.baseWeight * factor;
    if (!Number.isFinite(finalWeight) || finalWeight <= 0) return 0;

    return finalWeight;
  }
}
