import { RelationCollection } from '@domain/scengen/types/SettingModel';

export interface EntityRelations {
  parentId: string | null;
  relations: RelationCollection;
}
