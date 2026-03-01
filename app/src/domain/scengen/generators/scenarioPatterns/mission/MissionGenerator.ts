import { Injectable } from '@nestjs/common';
import { BaseScenarioPattern } from '@domain/scengen/generators/scenarioPatterns/BaseScenarioPattern';
import * as Mission from '@domain/scengen/generators/scenarioPatterns/mission/index';
import * as Domain from '@domain/scengen/domain';
import { RelationTag } from '@domain/scengen/types/RelationTag';
import { roll } from '@shared/util/random';
import { Lang } from '@shared/types/Lang';
import { Requirements } from '@domain/scengen/types/Requirements';

/**
 * Mission Execution scenario pattern
 *
 * The party is given a mission to complete. They travel from the start location
 * to the destination where they explore sub-locations to complete their goal.
 */
@Injectable()
export class MissionGenerator extends BaseScenarioPattern {
  public override generate(params: Mission.RequestDto): Domain.Scenario {
    const setting = this.settingService.getSetting(params.setting);
    const scenario = new Domain.Scenario(setting);
    const profile = scenario.profile;
    profile.applyEffects({
      complexity: 0.1,
    });

    const theme = params.theme
      ? setting.getTheme(params.theme)
      : this.pickerService.pickOne(setting.themes.values(), profile).picked;
    scenario.addEntity(Label.THEME, theme);

    const enemyFaction = params.enemyFaction
      ? setting.getFaction(params.enemyFaction)
      : this.pickerService.pickOne(setting.factions.values(), profile).picked;
    scenario.addEntity(Label.ENEMY, enemyFaction);

    const mainLocation = params.location
      ? setting.getLocation(params.location)
      : this.pickerService.pickOne(setting.locations.values(), profile).picked;
    scenario.addEntity('mainLocation', mainLocation);

    const employerFaction = params.friendlyFaction
      ? setting.getFaction(params.friendlyFaction)
      : this.pickerService.pickOne(setting.factions.values(), profile, {
          allTags: ['playable'],
        }).picked;
    scenario.addEntity(Label.EMPLOYER, employerFaction);
    if (enemyFaction.id === employerFaction.id) {
      profile.applyEffects({ hidden_truth: 0.4 });
    }

    const target = this.pickerService.pickOne(
      setting.targets.values(),
      profile,
    );
    const goal = this.pickerService.pickOne(setting.goals.values(), profile);
    console.log({ target, goal }); // DELETE

    let lastScene: Domain.Scene;

    // The scenario starts at a briefing conducted by the friendly faction at its friendly location.
    scenario.addEntity(
      Label.BRIEFING_LOCATION,
      this.pickerService.pickOne(setting.locations.values(), profile, {
        requiredRelations: { [RelationTag.PRESENCE]: employerFaction.id },
      }).picked,
    );

    const briefingScene = this.createScene(Label.BRIEFING, setting, scenario);
    lastScene = scenario.scenes.addScene(briefingScene);
    scenario.scenes.start = briefingScene;

    // The characters travel to the main location of the scenario.
    // During their travel, there could be some random encounters.

    for (let i = 0; i < params.travelScenes; i++) {
      const travelScene = this.createScene('travel', setting, scenario);
      scenario.scenes.addEdge(lastScene, travelScene);
      lastScene = scenario.scenes.addScene(travelScene);
    }

    // At last, they arrive at the main location of the scenario.

    const arrivalScene = this.createScene('arrival', setting, scenario);
    scenario.scenes.addEdge(lastScene, arrivalScene);
    lastScene = scenario.scenes.addScene(arrivalScene);

    // Now, they can do some intel gathering.
    // There are several ways they can do it; each leads to a different, linear scene set.
    // Theoretically, the party can do each set of scenes in any order, and they are
    // all optional. So, each set starts and ends at the "arrival" scene.

    const intelScenes: Domain.SceneSet[] = [];
    const intelSceneCount = roll(4) - 1;
    for (let i = 0; i < intelSceneCount; i++) {
      const intelSet = new Domain.SceneSet();

      let lastIntelScene: Domain.Scene | undefined = undefined;
      for (let j = 0; j < roll(3); j++) {
        const intelScene = this.createScene('intel', setting, scenario);
        intelSet.addScene(intelScene);
        if (lastIntelScene) intelSet.addEdge(lastIntelScene, intelScene);
        lastIntelScene = intelScene;
      }

      intelScenes.push(intelSet);
    }
    scenario.scenes.addSet(lastScene, this.parallelize(intelScenes, lastScene));

    // Now, the party can attempt to strike on the main site of the scenario.
    // The main site's type is either provided by the user or randomly picked.
    // The proper scene set for a given site type will be generated.

    const mainSiteGenerator = params.mainSiteType
      ? this.sceneFactory.getSceneSet(params.mainSiteType)
      : this.sceneFactory.getSceneSet('placeholder'); // DELETE & uncomment below
    // : this.sceneFactory.pickSceneSet(scenario);

    const mainSiteSceneSet = mainSiteGenerator.generate(roll(10) - 1);
    lastScene = scenario.scenes.addSet(lastScene, mainSiteSceneSet);

    // Scenes at the main site lead to its `finish` (possibly boss fight)
    // and then to the "finale" scene. That scene is both a victory and
    // a fallout scene

    const finaleScene = this.createScene('finale', setting, scenario);
    scenario.scenes.addScene(finaleScene);
    scenario.scenes.addEdge(lastScene, finaleScene);

    return scenario;
  }

  private createScene(
    id: string,
    setting: Domain.Setting,
    scenario: Domain.Scenario,
    requirements: Requirements = {},
  ): Domain.Scene {
    console.log({ setting, scenario, id, requirements }); // DELETE
    return new Domain.Scene(id);
  }

  public toPrompt(scenario: Domain.Scenario, lang: Lang): string {
    return `
      Write a scenario for a ${scenario.setting.name} RPG. Translate it into ${lang}. 
      Below you can find the constraints:
      - the scenario is about a mission execution
      - the scenario starts in a briefing room of ${scenario.entities.get(Label.EMPLOYER)!.name[lang]!} on ${scenario.entities.get(Label.BRIEFING_LOCATION)!.name[lang]!}
    `;
  }
}

enum Label {
  // settings
  THEME = 'theme',

  // scenes
  BRIEFING = 'briefing',
  TRAVEL = 'travel',
  ARRIVAL = 'arrival',
  INTEL = 'intel',
  MAIN_SITE = 'mainSite',
  FINALE = 'finale',

  // factions
  EMPLOYER = 'employer',
  ENEMY = 'enemy',

  // locations
  MAIN_LOCATION = 'mainLocation',
  BRIEFING_LOCATION = 'briefingLocation',
}
