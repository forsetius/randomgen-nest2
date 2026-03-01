import { Location } from '@domain/scengen/domain/entities/Location';
import { Faction } from '@domain/scengen/domain/entities/Faction';
import { Npc } from '@domain/scengen/domain/entities/Npc';

export interface Scene {
  id: string;
  type: string; // hook | negotiation | incident | investigation | confrontation | fallout | finale)
  title: string;
  location: Location;
  entryPrerequisites: string[];
  initialSetup: string;
  opportunities: string[];
  factions: {
    faction: Faction;
    goals: string[];
    means: string[];
    motives: string[];
    actions: string[];
  }[];
  npcs: {
    npc: Npc;
    goals: string[];
    means: string[];
    motives: string[];
    actions: string[];
  }[];
  players: {
    goals: string[];
  };
}
