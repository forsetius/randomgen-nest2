import { SceneSet } from '@domain/scengen/domain/SceneSet';
import { EntityId } from '@domain/scengen/types/aliases';
import { Lang } from '@shared/types/Lang';
import { ScenarioProfile } from '@domain/scengen/domain/ScenarioProfile';
import { Setting } from '@domain/scengen/domain/Setting';
import { Entity } from '@domain/scengen/domain/entities/Entity';

export class Scenario {
  public readonly profile: ScenarioProfile;
  public readonly entities = new Map<EntityId, Entity>();
  public readonly scenes = new SceneSet();

  public constructor(
    public readonly setting: Setting,
    profile?: ScenarioProfile,
  ) {
    this.profile = profile ?? new ScenarioProfile();
  }

  public addEntity(key: string, entity: Entity) {
    this.profile.applyEffects(entity.modifyProfile());
    this.entities.set(key, entity);
  }

  public toJson(lang: Lang) {
    if (!this.scenes.start || !this.scenes.finish) {
      throw new Error('Scenario must have a start an an end scene');
    }

    return {
      scenes: this.scenes.toJson(lang),
    };
  }
}
