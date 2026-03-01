import * as Picker from '@domain/scengen/types/PickerTypes';

export class RouletteWheelSelector implements Picker.Selector {
  public select<T>(
    candidates: readonly Picker.Candidate<T>[],
    rng: () => number,
  ): Picker.PickOneResult<T> {
    if (candidates.length === 0) {
      throw new Error('No eligible candidates to pick from.');
    }

    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);

    if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
      throw new Error('Total level must be > 0.');
    }

    const roll = rng() * totalWeight;

    let cumulative = 0;
    for (const candidate of candidates) {
      cumulative += candidate.weight;
      if (roll < cumulative) {
        return {
          picked: candidate.entity,
          usedWeight: candidate.weight,
          totalWeight,
          consideredCount: candidates.length,
          eligibleCount: candidates.length,
        };
      }
    }

    // Floating-point fallback
    const last = candidates[candidates.length - 1]!;
    return {
      picked: last.entity,
      usedWeight: last.weight,
      totalWeight,
      consideredCount: candidates.length,
      eligibleCount: candidates.length,
    };
  }
}
