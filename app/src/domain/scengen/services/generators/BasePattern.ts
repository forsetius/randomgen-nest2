import { Setting } from '@domain/scengen/domain/Setting';
import { Entity } from '@domain/scengen/domain/Entity';
import { roll } from '@shared/util/random';
import { Requirements } from '@domain/scengen/types/Requirements';

export abstract class BasePattern {
  public abstract generate(
    setting: Setting,
    requirements: Requirements,
  ): string;

  protected getRandom<E extends Entity>(
    coll: Map<string, E>,
    requirement: string[],
  ): E {
    const weighEntity = (e: E, tags: string[]): number => {
      // FIXME
      return (
        e.name.pl?.length ??
        0 +
          requirement.reduce(
            (acc, tag) => acc + (tags.includes(tag) ? 1 : 0),
            0,
          )
      );
    };
    const vals = Array.from(coll.values()).map((e) => [e, 0] as [E, number]);

    let sum = 0;
    const weighted = vals.map(([e]) => {
      sum += weighEntity(e, requirement);

      return { entity: e, sum };
    });

    const position = roll(sum);

    return weighted.find(({ sum }) => sum >= position)!.entity;
  }
}
