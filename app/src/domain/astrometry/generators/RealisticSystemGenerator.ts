import { StarSystem } from '../domain/StarSystem';
import { Options } from '../types/Options';
import { BaseSystemGenerator } from './BaseSystemGenerator';
import { Injectable } from '@nestjs/common';
import { OrbitType } from '../types/OrbitType';
import { RollableCollection } from '@shared/util/struct/RollableCollection';
import { rollDice } from '@shared/util/random';
import starCount from '../../../../dict/astrometry/starCount.json';

@Injectable()
export class RealisticSystemGenerator extends BaseSystemGenerator {
  private starCounts = new RollableCollection<number>(starCount);

  private companionOrbitTypeProbabilities = new RollableCollection<OrbitType>([
    { chance: 50, item: OrbitType.CLOSE },
    { chance: 10, item: OrbitType.MODERATE },
    { chance: 40, item: OrbitType.DISTANT },
  ]);

  public override rollAge(): number {
    return rollDice('4d25') * 100;
  }

  rollStarCount(): number {
    return this.starCounts.getRandom();
  }

  public override createStars(system: StarSystem, options: Options): void {
    system.center = new Array(options.starCount)
      .fill(undefined)
      .map(() => this.starGenerator.create(options.stage))
      .sort((a, b) => b.placement - a.placement);
  }

  public createStars(system: StarSystem, options: Options): void {
    system.center = new Array(options.starCount)
      .fill(undefined)
      .map(() =>
        this.spectralClassProbabilities.getRandom().create(options.age),
      )
      .sort((a, b) => b.mass - a.mass)
      .map((star, idx) => {
        star.orbitType =
          idx === 0
            ? OrbitType.PRIMARY
            : this.companionOrbitTypeProbabilities.getRandom();

        return star;
      });
  }
}
