import { G } from '../types/constants';
import { Star } from './Star';
import { DistanceValueObject } from './valueObjects/DistanceValueObject';
import { MassValueObject } from './valueObjects/MassValueObject';

export abstract class Orbital {
  parent: Orbital | Star;
  semiMajorAxis: DistanceValueObject;
  excenticity: number; // unitless

  radius: DistanceValueObject;
  meanDensity: number;
  rotationPeriod: number;
  axialTilt: number;

  satellites: Orbital[] = [];

  get pericenter(): DistanceValueObject {
    return new DistanceValueObject(
      (1 - this.excenticity) * this.semiMajorAxis.value,
    );
  }

  get apocenter(): DistanceValueObject {
    return new DistanceValueObject(
      (1 + this.excenticity) * this.semiMajorAxis.value,
    );
  }

  get mass(): MassValueObject {
    return new MassValueObject(
      (4 / 3) * Math.PI * Math.pow(this.radius.value, 3) * this.meanDensity,
    );
  }

  get surfaceGravity(): number {
    return ((4 * Math.PI) / 3) * G * this.meanDensity * this.radius.value;
  }

  get escapeVelocity(): number {
    return Math.sqrt(2 * this.surfaceGravity * this.radius.value);
  }

  get orbitalPeriod(): number {
    return (
      2 *
      Math.PI *
      Math.sqrt(
        Math.pow(this.semiMajorAxis.value, 3) / (G * this.parent.mass.value),
      )
    );
  }
}
