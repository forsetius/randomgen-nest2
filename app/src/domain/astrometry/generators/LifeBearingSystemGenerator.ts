import { BaseSystemGenerator } from './BaseSystemGenerator';
import { rollBetween, rollDice } from '@shared/util/random';
import { StarSystem } from '../domain/StarSystem';
import { Options } from '../types/Options';
import { RollableCollection } from '@shared/util/struct/RollableCollection';
import { Star } from '../domain/Star';
import { OrbitType } from '../types/OrbitType';
import { Injectable } from '@nestjs/common';
import { Timeline } from '../domain/Timeline';
import { AstrometryGenerateSystemQueryDto } from '../dto/AstrometryGenerateSystemQueryDto';
import { StarGenerator } from './StarGenerator';
import { Disc } from '../domain/Disc';
import { G } from '../types/constants';
import { MassValueObject } from '../domain/valueObjects/MassValueObject';

@Injectable()
export class LifeBearingSystemGenerator extends BaseSystemGenerator {
  private spectralClassProbabilities = new RollableCollection<string>([
    { chance: 10, item: 'F' },
    { chance: 55, item: 'G' },
    { chance: 25, item: 'K' },
  ]);

  public create(options: AstrometryGenerateSystemQueryDto): Timeline {
    const starSystem = new StarSystem();
    const timeline = new Timeline(starSystem);
    starSystem.age = this.rollAge();

    this.createStar(timeline);
    this.createDisk(timeline);

    return timeline;
  }

  protected rollAge(): number {
    return rollDice('3d12kh') * 500;
  }

  protected override rollStarCount(): number {
    return 1;
  }

  private createStar(timeline: Timeline): void {
    const star = StarGenerator.create(
      this.spectralClassProbabilities.getRandom(),
    );
    timeline.starSystem.center = [star];
    timeline.starSystem.calculateZones();

    timeline.insertAt(star.stages.mature, () =>
      this.matureStar(timeline.starSystem),
    );
    timeline.insertAt(star.stages.old, () => this.ageStar(timeline.starSystem));
  }

  private createDisk(
    timeline: Timeline,
    options: Required<AstrometryGenerateSystemQueryDto>,
  ) {
    const orbitalsCount = rollBetween(
      options.minRockies + options.minGiants,
      (options.maxRockies + options.maxGiants) * 1.5,
    );

    const massOfStars = new MassValueObject(timeline.starSystem.center.reduce((pV, cV) => pV + cV.mass.value, 0));
    const firstOrbit = 0.4 * massOfStars.get('Ms');

    timeline.starSystem.orbits = new Array(orbitalsCount)
      .fill(undefined)
      .map((el, idx) => {
        const radius =
        return new Disc();
      });
  }

  private createGiants(
    timeline: Timeline,
    options: Required<AstrometryGenerateSystemQueryDto>,
  ): void {
    const giantsCount = rollBetween(options.minGiants, options.maxGiants);
    for (let i = 0; i < giantsCount; i++) {
      timeline.starSystem.orbitals.push(
        this.giantGenerator.create(timeline.starSystem),
      );
    }

    timeline.insertAt(5, () => this.tackGiants(timeline));
  }

  public makeNewborn(): void {
    this.createStar();
    this.createGiants();
    this.tackGiants();
    this.createRockies();
  }

  public makeJuvenile(): void {
    this.cullRockies();
    this.bombard();
    this.matureStar();
    this.ageRockies();
    this.acquireSatellites();
  }

  public makeMature(): void {
    this.evolveRockies();
  }

  public makeOld(): void {
    this.falterStar();
    this.stagnateRockies();
    this.diminishSatellites();
  }

  public makeDead(): void {}
}
