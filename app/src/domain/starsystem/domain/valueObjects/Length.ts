import { ValueObject } from './ValueObject';

export const AU_TO_KM = 149597870n;
export const EARTH_RADIUS_KM = 6371n;
export const JUPITER_RADIUS_KM = 69911n;
export const SUN_RADIUS_KM = 695508n;

export class Length extends ValueObject<bigint> {
  public readonly unit = 'km';

  public getAsEarthRadii(): number {
    return Number(this.value / EARTH_RADIUS_KM);
  }

  public getAsJupiterRadii(): number {
    return Number(this.value / JUPITER_RADIUS_KM);
  }

  public getAsSunRadii(): number {
    return Number(this.value / SUN_RADIUS_KM);
  }

  public getAsAU(): number {
    return Number(this.value / AU_TO_KM);
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
}
