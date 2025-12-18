import { Level } from '@domain/scengen/types/Level';
import { LangString } from '@shared/types/LangString';
import { RelationTag } from '@domain/scengen/types/RelationTag';
import { EntityKind } from '@domain/scengen/types/EntityKind';

export interface EntityData {
  kind: EntityKind;
  id: EntityId;
  parentId: EntityId | null;
  name: LangString;
  description?: LangString;
  url?: LangString;
  importance?: Level;
}

export interface FactionData extends EntityData {
  securityLevel: Level;
  relations?: Partial<Record<RelationTag, Record<string, number>>>;
}

export interface LocationData extends EntityData {
  securityLevel: Level;
  relations?: Partial<Record<RelationTag, Record<string, number>>>;
}

export interface ThemeData extends EntityData {
  factions: Record<EntityId, Weight>;
  locations: Record<EntityId, Weight>;
}

type EntityId = string;
type Weight = number;
