import { Injectable } from '@nestjs/common';
import { ScenarioPattern } from '@domain/scengen/ScenGenConstants';
import { Setting } from '@domain/scengen/domain/Setting';
import { BasePattern } from '@domain/scengen/services/generators/BasePattern';
import { Requirements } from '@domain/scengen/types/Requirements';

/**
 * Conflict of Interests scenario pattern
 *
 * There is a resource, person, or event in the setting that several factions
 * are competing for. Characters get caught in the crossfire.
 */
@Injectable()
@ScenarioPattern('conflict_of_interests')
export class ConflictOfInterestsPattern extends BasePattern {
  public generate(setting: Setting, requirements: Requirements): string {
    const location = setting.locations;
    // const factions = setting.factions.getRandom({ location });
    // const conflictObject = pickRandomly([
    //   () => setting.locations.getRandom({ location, factions }),
    //   () => setting.assets.getRandom({ location, factions }),
    //   () => setting.npcs.getRandom({ location, factions }),
    // ])();

    return (
      (requirements.location ?? this.getRandom(location, [])).name.pl ?? ''
    );
  }

  // private rollFactions(
  //   count: number,
  //   location: string,
  //   setting: Setting,
  // ): ScenarioFaction[] {
  //   const factions = new Set<Faction>();
  //   while (factions.size < count) {
  //     const faction = setting.factions.getRandom({ location });
  //     factions.add(faction);
  //   }
  //
  //   let roles = new Array<FactionGoal>(count).fill(FactionGoal.CLAIMANT);
  //   (
  //     [
  //       [1, pickRandomly([FactionGoal.HOLDER, FactionGoal.CLAIMANT])],
  //       [2, pickRandomly([FactionGoal.BROKER, FactionGoal.SABOTEUR])],
  //     ] as [number, FactionGoal][]
  //   ).forEach(([slot, role]) => {
  //     if (roles.length > slot) {
  //       roles[slot] = role;
  //     }
  //   });
  //   roles = shuffle(roles);
  //
  //   return setting.factions.getRandom();
  // }
}

// class ScenarioFaction {
//   public readonly npc: Npc[] = [];
//   public goal: FactionGoal = FactionGoal.CLAIMANT;
//   public constructor(public readonly faction: Faction) {}
// }

// enum FactionGoal {
//   CLAIMANT = 'claimant', // wants it directly
//   HOLDER = 'holder', // currently has the object, or controls access
//   SABOTEUR = 'saboteur', // wants to destroy/deny/let it escape
//   BROKER = 'broker', // wants to sell/mediate
// }
