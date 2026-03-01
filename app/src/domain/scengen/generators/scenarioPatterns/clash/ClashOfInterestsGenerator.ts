import { Injectable } from '@nestjs/common';
import { BaseScenarioPattern } from '@domain/scengen/generators/scenarioPatterns/BaseScenarioPattern';
import * as Clash from '@domain/scengen/generators/scenarioPatterns/clash/index';

/**
 * Conflict of Interests scenario pattern
 *
 * There is a resource, person, or event in the setting that several factions
 * are competing for. Characters get caught in the crossfire.
 */
@Injectable()
export class ClashOfInterestsGenerator extends BaseScenarioPattern {
  public generate(params: Clash.RequestDto): string {
    const setting = this.settingService.getSetting(params.setting);

    const location = setting.getLocation(params.location ?? '');
    // const factions = setting.factions.getRandom({ location });
    // const conflictObject = pickRandomly([
    //   () => setting.locations.getRandom({ location, factions }),
    //   () => setting.assets.getRandom({ location, factions }),
    //   () => setting.npcs.getRandom({ location, factions }),
    // ])();

    return location.name.pl!;
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
//   HOLDER = 'holder', // currently hasValue the object, or controls access
//   SABOTEUR = 'saboteur', // wants to destroy/deny/let it escape
//   BROKER = 'broker', // wants to sell/mediate
// }
