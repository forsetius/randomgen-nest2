import { DistanceValueObject } from './valueObjects/DistanceValueObject';

export class Orbit {
  public constructor(
    public semiMajorAxis: DistanceValueObject,
    public excenticity: number = 0, // unitless
  ) {}
}
