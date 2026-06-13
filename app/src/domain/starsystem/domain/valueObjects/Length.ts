import { divideWithPrecision } from '../../../../shared/util/bigint';
import { ValueObject } from './ValueObject';

export const AU_TO_KM = 149597870n;
export const EARTH_RADIUS_KM = 6371n;
export const JUPITER_RADIUS_KM = 69911n;
export const SUN_RADIUS_KM = 695508n;
const LENGTH_PRECISION = 6n;
const LENGTH_PRECISION_FACTOR = 10n ** LENGTH_PRECISION;

export class Length extends ValueObject<bigint> {
  public readonly unit = 'km';

  public getAsEarthRadii(): number {
    return divideWithPrecision(
      this.value,
      EARTH_RADIUS_KM,
      LENGTH_PRECISION_FACTOR,
    );
  }

  public getAsJupiterRadii(): number {
    return divideWithPrecision(
      this.value,
      JUPITER_RADIUS_KM,
      LENGTH_PRECISION_FACTOR,
    );
  }

  public getAsSunRadii(): number {
    return divideWithPrecision(
      this.value,
      SUN_RADIUS_KM,
      LENGTH_PRECISION_FACTOR,
    );
  }

  public getAsAU(): number {
    return divideWithPrecision(this.value, AU_TO_KM, LENGTH_PRECISION_FACTOR);
  }

  public plus(other: Length): Length {
    return new Length(this.value + other.value);
  }

  public minus(other: Length): Length {
    return new Length(this.value - other.value);
  }

  public times(factor: number | Length): Length {
    if (typeof factor === 'number') {
      return new Length(this.value * BigInt(factor));
    }

    return new Length(this.value * factor.value);
  }

  public dividedBy(other: number | Length): Length {
    if (typeof other === 'number') {
      return new Length(this.value / BigInt(other));
    }

    return new Length(this.value / other.value);
  }

  public override toJSON(): object {
    return {
      value: this.value.toString(),
      earthRadii: this.getAsEarthRadii(),
      jupiterRadii: this.getAsJupiterRadii(),
      sunRadii: this.getAsSunRadii(),
      au: this.getAsAU(),
    };
  }
}
