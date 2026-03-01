import * as Domain from '../domain';
import { RelationTag } from '@domain/scengen/types/RelationTag';

export interface Requirements {
  minimumSignals?: Partial<Record<Domain.ScenarioSignalKey, number>>;
  allTags?: readonly string[];
  anyTags?: readonly string[];
  requiredRelations?: Partial<Record<RelationTag, string | readonly string[]>>;
}
