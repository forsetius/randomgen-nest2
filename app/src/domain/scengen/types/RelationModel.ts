import { RelationTag } from '@domain/scengen/types/RelationTag';
import { Level } from '@domain/scengen/types/Level';

export interface RelationModel {
  entityId: string;
  tag: RelationTag;
  weight: Level;
}
