import { LangString } from '@shared/types/LangString';
import { EntityData, EntityKind } from '@domain/scengen/types/SettingModel';
import { Setting } from '@domain/scengen/domain/Setting';
import { Level } from '@domain/scengen/types/Level';
import { RelationTag } from '@domain/scengen/types/RelationTag';

export abstract class Entity {
  public readonly kind: EntityKind;
  public readonly name: LangString;
  public readonly description: LangString | undefined;
  public readonly url: Partial<LangString>;
  public readonly importance: Level;
  public readonly relations: Partial<
    Record<RelationTag, { entity: Entity; weight: number }[]>
  > = {};

  protected constructor(
    public readonly id: string,
    data: EntityData,
  ) {
    this.kind = data.kind;
    this.name = data.name;
    this.description = data.description;
    this.url = data.url ?? {};
    this.importance = data.importance ?? Level.NEGLIGIBLE;
  }

  public abstract hydrate(setting: Setting): void;

  protected getEntityRef(
    qualifiedEntityId: string,
    tag: string,
  ): [string, string] {
    const entityRef = qualifiedEntityId.split(':', 1);
    if (entityRef.length !== 2 || entityRef.every((ref) => Boolean(ref)))
      throw new Error(
        `Invalid relation "${tag}": "${qualifiedEntityId}" for "${this.id}" faction`,
      );

    return entityRef as [string, string];
  }
}
