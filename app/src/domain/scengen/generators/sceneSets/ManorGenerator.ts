import * as Domain from '@domain/scengen/domain';
import { Injectable } from '@nestjs/common';
import { SceneSetPattern } from '@domain/scengen/ScenGenConstants';
import { BaseSceneSetPattern } from '@domain/scengen/generators/sceneSets/BaseSceneSetPattern';

@Injectable()
@SceneSetPattern('manor')
export class ManorGenerator extends BaseSceneSetPattern {
  public name = 'manor';

  public generate(sceneCount: number): Domain.SceneSet {
    console.log(`${sceneCount.toString()} scenes for ${this.name}`);
    throw new Error('Method not implemented.');
  }
}
