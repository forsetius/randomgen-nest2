import {
  divideAndRoundUp,
  divideWithPrecision,
} from '../../../../shared/util/bigint';
import { ValueObject } from './ValueObject';

export const EARTH_MASS = BigInt(5.9722e24);
export const JUPITER_MASS = BigInt(1.8982e27);
export const SUN_MASS = BigInt(1.9886e30);
export const MIN_STAR_MASS = 80n * JUPITER_MASS;
export const MAX_STAR_MASS = 300n * SUN_MASS;
export const MIN_BROWN_DWARF_MASS = 13n * JUPITER_MASS;
const MASS_PRECISION = 6n;
const MASS_PRECISION_FACTOR = 10n ** MASS_PRECISION;

export class Mass extends ValueObject<bigint> {
  public readonly unit = 'kg';

  public static fromSunMasses(sunMasses: number): Mass {
    const scaledSunMasses = BigInt(
      Math.floor(sunMasses * Number(MASS_PRECISION_FACTOR)),
    );

    return new Mass(
      divideAndRoundUp(scaledSunMasses * SUN_MASS, MASS_PRECISION_FACTOR),
    );
  }

  public getAsEarthMass(): number {
    return divideWithPrecision(this.value, EARTH_MASS, MASS_PRECISION_FACTOR);
  }

  public getAsJupiterMass(): number {
    return divideWithPrecision(this.value, JUPITER_MASS, MASS_PRECISION_FACTOR);
  }

  public getAsSunMass(): number {
    return divideWithPrecision(this.value, SUN_MASS, MASS_PRECISION_FACTOR);
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

  public override toJSON(): object {
    return {
      kg: this.value.toString(),
      earthMasses: this.getAsEarthMass(),
      jupiterMasses: this.getAsJupiterMass(),
      sunMasses: this.getAsSunMass(),
    };
  }
}
