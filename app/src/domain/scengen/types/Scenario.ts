import { Scene } from '@domain/scengen/types/Scene';
import { Faction } from '@domain/scengen/domain/entities/Faction';

export interface Scenario {
  pattern: string;
  subpattern: string;
  title: string;
  objective: string;
  rewards: string;
  synopsis: string;
  scenes: Scene[];
  factions: {
    faction: Faction;
    goals: string[];
    means: string[];
    motives: string[];
    opportunities: string[];
  };
}
