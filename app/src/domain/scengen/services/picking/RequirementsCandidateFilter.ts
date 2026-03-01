import * as Domain from '@domain/scengen/domain';
import * as Picker from '@domain/scengen/types/PickerTypes';
import { Requirements } from '@domain/scengen/types/Requirements';
import { clamp01 } from '@shared/util/number';
import * as object from '@shared/util/object';

function hasRequiredRelations(
  entityRelations: Picker.PickableEntity['relations'],
  requiredRelations: Requirements['requiredRelations'],
): boolean {
  if (!requiredRelations) return true;

  for (const [relationTag, rawRequiredTargets] of object.entries(
    requiredRelations,
  )) {
    const requiredTargets = Array.isArray(rawRequiredTargets)
      ? rawRequiredTargets
      : [rawRequiredTargets];

    const relationTargets = entityRelations.get(relationTag);
    if (!relationTargets) return false;

    let matched = false;
    for (const target of requiredTargets) {
      if (Object.prototype.hasOwnProperty.call(relationTargets, target)) {
        matched = true;
        break;
      }
    }
    if (!matched) return false;
  }

  return true;
}

export class RequirementsCandidateFilter implements Picker.CandidateFilter {
  public *filter<T extends Picker.PickableEntity>(
    collection: Iterable<T>,
    profile: Domain.ScenarioProfile,
    reqs: Requirements,
  ): Iterable<T> {
    const minimumSignals = reqs.minimumSignals ?? {};

    for (const entity of collection) {
      // Profile thresholds are scenario-level requirements.
      let ok = true;

      for (const [rawKey, rawMin] of object.entries(minimumSignals)) {
        const minValue = clamp01(rawMin);
        if (profile.get(rawKey) < minValue) {
          ok = false;
          break;
        }
      }

      if (
        !ok ||
        (reqs.allTags && !entity.tags.all(reqs.allTags)) ||
        (reqs.anyTags && !entity.tags.any(reqs.anyTags)) ||
        !hasRequiredRelations(entity.relations, reqs.requiredRelations)
      )
        continue;

      yield entity;
    }
  }
}
