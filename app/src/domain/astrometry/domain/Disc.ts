import { Orbit } from './Orbit';
import { DistanceValueObject } from './valueObjects/DistanceValueObject';

export class Disc extends Orbit {
  public constructor(
    semiMajorAxis: DistanceValueObject,
    public gases: number,
    public water: number,
    public dust: number,
  ) {
    super(semiMajorAxis);
  }
}
