import { Star } from './Star';
import { Length, Mass } from './valueObjects';
import { Orbit } from './Orbit';

export class System {
  public readonly stars: Star[] = [];
  public readonly orbits: Orbit[] = [];

  constructor(stars: Star[]) {
    this.stars = stars.sort((starA, starB) =>
      Number(starA.mass.minus(starB.mass).value),
    );
  }

  get mass(): Mass {
    return this.stars.reduce(
      (acc: Mass, star) => acc.plus(star.mass),
      new Mass(0n),
    );
  }

  get radius(): Length {
    if (this.orbits.length === 0) {
      return new Length(0n);
    }

    const lastOrbit = this.orbits.at(-1)!;

    return lastOrbit.semiMajorAxis.times(1 + lastOrbit.eccentricity);
  }
}
