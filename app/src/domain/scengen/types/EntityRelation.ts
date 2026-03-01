import { Entity } from '@domain/scengen/domain/entities/Entity';
import { RelationTag } from '@domain/scengen/types/RelationTag';
import { Level } from '@domain/scengen/types/Level';

export interface EntityRelation<T extends Entity> {
  entity: T;
  relation: RelationTag;
  weight: Level;
}
