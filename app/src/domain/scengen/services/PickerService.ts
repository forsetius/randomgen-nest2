import { Injectable } from '@nestjs/common';
import * as Domain from '@domain/scengen/domain';
import * as Picker from '@domain/scengen/types/PickerTypes';
import { Requirements } from '@domain/scengen/types/Requirements';
import { RouletteWheelSelector } from '@domain/scengen/services/picking/RouletteWheelSelector';
import { DefaultWeightComputer } from '@domain/scengen/services/picking/DefaultWeightComputer';
import { RequirementsCandidateFilter } from '@domain/scengen/services/picking/RequirementsCandidateFilter';

/**
 * Option B: A strategy-based picker:
 * - CandidateFilter: enforces hard requirements
 * - WeightComputer: computes final weights using profile modifiers
 * - Selector: performs roulette-wheel selection on weighted candidates
 */
@Injectable()
export class PickerService {
  public constructor(
    private readonly rng: RandomNumberGenerator = Math.random,
    private readonly filter: Picker.CandidateFilter = new RequirementsCandidateFilter(),
    private readonly weightComputer: Picker.WeightComputer = new DefaultWeightComputer(),
    private readonly selector: Picker.Selector = new RouletteWheelSelector(),
  ) {}

  public pickOne<T extends Picker.PickableEntity>(
    collection: Iterable<T>,
    profile: Domain.ScenarioProfile,
    requirements: Requirements = {},
  ): Picker.PickOneResult<T> {
    const eligible = this.filter.filter(collection, profile, requirements);

    const candidates: Picker.Candidate<T>[] = [];
    let consideredCount = 0;

    for (const entity of eligible) {
      consideredCount += 1;
      const weight = this.weightComputer.compute(entity, profile);
      if (weight > 0) {
        candidates.push({ entity, weight });
      }
    }

    if (candidates.length === 0) {
      throw new Error(
        'No eligible candidates to pick from after filtering and weighting.',
      );
    }

    const result = this.selector.select(candidates, this.rng);

    return {
      ...result,
      consideredCount,
      eligibleCount: candidates.length,
    };
  }
}

export type RandomNumberGenerator = () => number;
