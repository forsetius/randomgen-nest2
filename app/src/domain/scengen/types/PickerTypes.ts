import * as Domain from '../domain';
import { RelationTag } from '@domain/scengen/types/RelationTag';
import { Requirements } from '@domain/scengen/types/Requirements';
import { TagCollection } from '@domain/scengen/domain/TagCollection';

export interface PickableEntity {
  id: string;
  baseWeight: number;
  tags: TagCollection;
  relations: RelationCollection;
  profileModifiers: ProfileModifiers;
}

export interface Candidate<T> {
  entity: T;
  weight: number;
}

export interface PickOneResult<T> {
  picked: T;
  usedWeight: number;
  totalWeight: number;
  consideredCount: number;
  eligibleCount: number;
}

export interface CandidateFilter {
  filter<T extends PickableEntity>(
    collection: Iterable<T>,
    profile: Domain.ScenarioProfile,
    reqs: Requirements,
  ): Iterable<T>;
}

export interface WeightComputer {
  compute(entity: PickableEntity, profile: Domain.ScenarioProfile): number;
}

export interface Selector {
  select<T>(
    candidates: readonly Candidate<T>[],
    rng: () => number,
  ): PickOneResult<T>;
}

export type RelationCollection = Map<
  RelationTag,
  { entity: Domain.Entity; weight: number }[]
>;

export type ProfileModifiers = Map<Domain.ScenarioSignalKey, number>;
