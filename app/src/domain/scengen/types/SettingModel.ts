import { Level } from '@domain/scengen/types/Level';
import { LangString } from '@shared/types/LangString';
import { RelationTag } from '@domain/scengen/types/RelationTag';
import { EntityKind } from '@domain/scengen/types/EntityKind';
import * as Domain from '@domain/scengen/domain';

export interface EntityData {
  kind: EntityKind;
  id: EntityId;
  name: LangString;
  description?: LangString;
  url?: LangString;
  baseWeight?: Level;
  tags?: string[];
  relations?: RelationCollection;
  profileModifiers?: ProfileModifiers;
}

export interface FactionData extends EntityData {
  securityLevel: Level;
  parentId: EntityId | null;
}

export interface LocationData extends EntityData {
  securityLevel: Level;
  parentId: EntityId | null;
}

export interface ThemeData extends EntityData {
  parentId: EntityId | null;
}

type EntityId = string;
export type RelationDataEntry = Record<EntityId, Level>;
export interface RelationEntry {
  entityId: EntityId;
  level: Level;
}
export type RelationCollection = Partial<
  Record<RelationTag, Record<EntityId, Level>>
>;
export type ProfileModifiers = Partial<
  Record<Domain.ScenarioSignalKey, number>
>;
