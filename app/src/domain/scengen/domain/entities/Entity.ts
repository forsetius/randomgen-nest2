import { LangString } from '@shared/types/LangString';
import { EntityData } from '@domain/scengen/types/SettingModel';
import { Level, LEVEL_WEIGHT } from '@domain/scengen/types/Level';
import { RelationTag } from '@domain/scengen/types/RelationTag';
import { EntityKind } from '@domain/scengen/types/EntityKind';
import { AutoArrayMap } from '@shared/util/collections/AutoArrayMap';
import { Lang } from '@shared/types/Lang';
import {
  ScenarioSignalContribution,
  ScenarioSignalKey,
} from '@domain/scengen/domain/ScenarioProfile';
import { PickableEntity } from '@domain/scengen/types/PickerTypes';
import * as object from '@shared/util/object';
import { TagCollection } from '@domain/scengen/domain/TagCollection';

export abstract class Entity implements PickableEntity {
  public readonly kind: EntityKind;
  public readonly name: LangString;
  public parent: Entity | null = null;
  public readonly subItems: Entity[] = [];
  public readonly description: LangString | undefined;
  public readonly url: Partial<LangString> | undefined;
  public readonly baseWeight: number;
  public readonly profileModifiers = new Map<ScenarioSignalKey, number>();
  public readonly tags: TagCollection;
  public readonly relations = new AutoArrayMap<
    RelationTag,
    { entity: Entity; weight: number }
  >();

  protected constructor(
    public readonly id: string,
    data: EntityData,
  ) {
    const weightLevel = data.baseWeight ?? Level.NEGLIGIBLE;

    this.kind = data.kind;
    this.name = data.name;
    this.description = data.description;
    this.url = data.url ?? {};
    this.baseWeight = LEVEL_WEIGHT[weightLevel];
    this.tags = new TagCollection(data.tags ?? []);
    object.entries(data.profileModifiers ?? {}).forEach(([signal, value]) => {
      this.profileModifiers.set(signal, value);
    });
  }

  public abstract modifyProfile(): ScenarioSignalContribution[];

  public toJson(lang: Lang): SerializedEntity {
    return {
      name: this.name[lang] ?? this.kind,
      ...(this.description ? { description: this.description[lang] } : {}),
      ...(this.url?.[lang] ? { url: this.url[lang] } : {}),
    };
  }
}

export interface SerializedEntity {
  name: string;
  description?: string;
  url?: string;
  [key: string]: string;
}
