import { SceneSet } from '@domain/scengen/domain/SceneSet';

export abstract class BaseSceneSetPattern {
  public abstract name: string;

  public abstract generate(sceneCount: number): SceneSet;
}
