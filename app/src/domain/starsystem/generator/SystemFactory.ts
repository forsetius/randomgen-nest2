import { StarFactory } from './StarFactory';
import { System } from '../domain/System';
import { Mass } from '../domain/valueObjects';
import { divideBetween } from '../util/divideBetween';
import { MAX_STAR_MASS, MIN_STAR_MASS } from '../domain/valueObjects/Mass';

export class SystemFactory {
  public constructor(
    protected readonly starFactory: StarFactory,
    protected readonly planetFactory: PlanetFactory,
  ) {}

  public createSystem(starCount: number, maxMass?: Mass): System {
    const mass =
      maxMass ??
      rollBetween(MIN_STAR_MASS * BigInt(starCount + 1, true), MAX_STAR_MASS);
    const solarMasses = divideBetween(mass, starCount, MIN_STAR_MASS);
    for (let i = 0; i < starCount; i++) {}
    const stars = new Array(starCount)
      .fill(undefined)
      .map(() => this.starFactory.createStar());

    return new System(stars);
  }

  private createOrbits(): void {}

  private fillOrbits(): void {}
}
