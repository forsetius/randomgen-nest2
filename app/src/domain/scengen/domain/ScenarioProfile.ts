import { clamp01 } from '@shared/util/number';
import * as object from '@shared/util/object';

export type ScenarioSignalKey =
  // Tone
  | 'adventure'
  | 'horror'
  | 'humor'
  | 'social'
  | 'weirdness'
  | 'grit'
  // Pressures
  | 'time_pressure'
  | 'scarcity'
  | 'social_pressure'
  | 'moral_pressure'
  | 'surveillance'
  | 'violence_pressure'
  | 'hidden_truth'
  // Structural
  | 'escalation'
  | 'scope'
  | 'complexity';

export type ScenarioSignalVector = Readonly<Record<ScenarioSignalKey, number>>;

export type ScenarioSignalContribution = Partial<
  Record<ScenarioSignalKey, number>
>;

/**
 * ScenarioProfile is a setting-agnostic vector of narrative "dials".
 *
 * Values are normalized to [0..1]. The profile is used to:
 * - bias weighted picks (goals/scenes/twists/NPC archetypes),
 * - parametrize planners (pace, reveal depth, scarcity pressure, etc.),
 * - validate / enforce minimum structural beats (e.g. reveal scene when hidden_truth is high).
 */
export class ScenarioProfile {
  private readonly vector: Record<ScenarioSignalKey, number>;
  private readonly appliedContributions: [ScenarioSignalKey, number][] = [];

  private static createZeroVector(): Record<ScenarioSignalKey, number> {
    return {
      // Tone
      horror: 0,
      humor: 0,
      weirdness: 0,
      adventure: 0,
      grit: 0,
      social: 0,
      // Pressures
      time_pressure: 0,
      scarcity: 0,
      social_pressure: 0,
      moral_pressure: 0,
      surveillance: 0,
      violence_pressure: 0,
      hidden_truth: 0,
      // Structural
      escalation: 0,
      scope: 0,
      complexity: 0,
    };
  }

  public constructor(initial?: Partial<Record<ScenarioSignalKey, number>>) {
    this.vector = ScenarioProfile.createZeroVector();

    if (initial) {
      for (const [rawKey, rawValue] of object.entries(initial)) {
        if (rawKey in this.vector) {
          this.vector[rawKey] = clamp01(rawValue);
        }
      }
    }
  }

  public static empty(): ScenarioProfile {
    return new ScenarioProfile();
  }

  public static from(
    initial: Partial<Record<ScenarioSignalKey, number>>,
  ): ScenarioProfile {
    return new ScenarioProfile(initial);
  }

  public get(key: ScenarioSignalKey): number {
    return this.vector[key];
  }

  public toJSON(): ScenarioSignalVector {
    return Object.freeze({ ...this.vector }) as ScenarioSignalVector;
  }

  /**
   * Apply additive contributions and clamp each affected signal to [0..1].
   * Use this for tag->signal mappings, extractors, and rule outputs.
   */
  public applyEffects(contributions: ScenarioSignalContribution): this {
    for (const [signal, value] of object.entries(contributions)) {
      const current = this.vector[signal];
      this.vector[signal] = clamp01(current + value);
      this.appliedContributions.push([signal, value]);
    }
    return this;
  }

  /**
   * Multiply all signals by a factor (e.g. global intensity scaling),
   * then clamp to [0..1]. Useful when you want to "soften" or "amplify"
   * a profile without changing its shape.
   */
  public scale(factor: number): this {
    const safeFactor = Number.isFinite(factor) ? factor : 0;

    for (const key of Object.keys(this.vector) as ScenarioSignalKey[]) {
      const next = clamp01(this.vector[key] * safeFactor);
      const delta = next - this.vector[key];
      this.vector[key] = next;

      if (delta !== 0) {
        this.appliedContributions.push([key, delta]);
      }
    }

    return this;
  }

  /**
   * Merge another profile into this one using weighted average:
   * this = lerp(this, other, alpha)
   */
  public blend(other: ScenarioProfile, alpha: number): this {
    const a = clamp01(alpha);

    for (const key of Object.keys(this.vector) as ScenarioSignalKey[]) {
      const current = this.vector[key];
      const target = other.get(key);
      const next = clamp01(current * (1 - a) + target * a);
      const delta = next - current;

      this.vector[key] = next;
      if (delta !== 0) {
        this.appliedContributions.push([key, delta]);
      }
    }

    return this;
  }

  /**
   * Returns a compact list of the strongest signals, useful for debugging/logging.
   */
  public topSignals(limit = 6): { key: ScenarioSignalKey; value: number }[] {
    const safeLimit = Math.max(1, Math.floor(limit));

    return (Object.keys(this.vector) as ScenarioSignalKey[])
      .map((key) => ({ key, value: this.vector[key] }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, safeLimit);
  }

  /**
   * Returns applied contributions history (debug)
   */
  public getContributionHistory(): readonly [ScenarioSignalKey, number][] {
    return this.appliedContributions;
  }

  /**
   * Convenience: build a "pressure profile" view for UI/debug.
   */
  public toPressureSummary(): {
    tone: Record<string, number>;
    pressures: Record<string, number>;
    structure: Record<string, number>;
  } {
    const v = this.vector;

    return {
      tone: {
        horror: v.horror,
        weirdness: v.weirdness,
        adventure: v.adventure,
        grit: v.grit,
        social: v.social,
      },
      pressures: {
        time: v.time_pressure,
        scarcity: v.scarcity,
        social: v.social_pressure,
        moral: v.moral_pressure,
        surveillance: v.surveillance,
        grit: v.violence_pressure,
        hidden_truth: v.hidden_truth,
      },
      structure: {
        escalation: v.escalation,
        scope: v.scope,
        complexity: v.complexity,
      },
    };
  }
}
