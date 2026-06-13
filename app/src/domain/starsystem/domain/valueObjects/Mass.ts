import { ValueObject } from './ValueObject';

export const EARTH_MASS = BigInt(5.9722e24);
export const JUPITER_MASS = BigInt(1.8982e27);
export const SUN_MASS = BigInt(1.9886e30);
export const MIN_STAR_MASS = 80n * JUPITER_MASS;
export const MAX_STAR_MASS = 300n * SUN_MASS;
export const MIN_BROWN_DWARF_MASS = 13n * JUPITER_MASS;

export class Mass extends ValueObject<bigint> {
  public readonly unit = 'kg';

  public getAsEarthMass(): number {
    return Number(this.value / EARTH_MASS);
  }

  public getAsJupiterMass(): number {
    return Number(this.value / JUPITER_MASS);
  }

  public getAsSunMass(): number {
    return Number(this.value / SUN_MASS);
  }

  public plus(other: Mass): Mass {
    return new Mass(this.value + other.value);
  }

  public minus(other: Mass): Mass {
    return new Mass(this.value - other.value);
  }

  public times(factor: number | Mass): Mass {
    if (typeof factor === 'number') {
      return new Mass(this.value * BigInt(factor));
    }

    return new Mass(this.value * factor.value);
  }

  public dividedBy(other: number | Mass): Mass {
    if (typeof other === 'number') {
      return new Mass(this.value / BigInt(other));
    }

    return new Mass(this.value / other.value);
  }
}
