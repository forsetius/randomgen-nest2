import {
  Length,
  Mass,
  Period,
  Velocity,
  Acceleration,
} from '../domain/valueObjects';
import { AU_TO_KM, EARTH_RADIUS_KM } from '../domain/valueObjects/Length';
import { EARTH_MASS } from '../domain/valueObjects/Mass';

const DAYS_PER_JULIAN_YEAR = 365.25;
const EARTH_RADIUS_KM_AS_NUMBER = Number(EARTH_RADIUS_KM);
const AU_TO_KM_AS_NUMBER = Number(AU_TO_KM);
const EARTH_MASS_AS_NUMBER = Number(EARTH_MASS);
const GRAVITATIONAL_CONSTANT = 6.6743e-11;
const KILOMETERS_TO_METERS = 1000;

export function clampNumber(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function createLengthFromAstronomicalUnits(
  astronomicalUnits: number,
): Length {
  return new Length(
    BigInt(Math.max(1, Math.round(astronomicalUnits * AU_TO_KM_AS_NUMBER))),
  );
}

export function createLengthFromEarthRadii(earthRadii: number): Length {
  const safeEarthRadii = Number.isFinite(earthRadii) ? earthRadii : 1;

  return new Length(
    BigInt(Math.max(1, Math.round(safeEarthRadii * EARTH_RADIUS_KM_AS_NUMBER))),
  );
}

export function createMassFromEarthMasses(earthMasses: number): Mass {
  return new Mass(
    BigInt(Math.max(1, Math.round(earthMasses * EARTH_MASS_AS_NUMBER))),
  );
}

export function createPeriodFromDays(days: number): Period {
  return new Period(days);
}

export function calculateOrbitalPeriodDays(
  semiMajorAxisAu: number,
  totalMassInSolarMasses: number,
): number {
  return (
    Math.sqrt(
      (semiMajorAxisAu * semiMajorAxisAu * semiMajorAxisAu) /
        totalMassInSolarMasses,
    ) * DAYS_PER_JULIAN_YEAR
  );
}

export function calculatePeriapsisDistanceAu(
  semiMajorAxisAu: number,
  eccentricity: number,
): number {
  return semiMajorAxisAu * (1 - eccentricity);
}

export function calculateApoapsisDistanceAu(
  semiMajorAxisAu: number,
  eccentricity: number,
): number {
  return semiMajorAxisAu * (1 + eccentricity);
}

export function computeSTypeCriticalSemiMajorAxis(
  binarySemiMajorAxisAu: number,
  eccentricity: number,
  companionMassFraction: number,
): number {
  const ratio =
    0.464 -
    0.38 * companionMassFraction -
    0.631 * eccentricity +
    0.586 * companionMassFraction * eccentricity +
    0.15 * eccentricity * eccentricity -
    0.198 * companionMassFraction * eccentricity * eccentricity;

  return binarySemiMajorAxisAu * ratio;
}

export function computePTypeCriticalSemiMajorAxis(
  binarySemiMajorAxisAu: number,
  eccentricity: number,
  companionMassFraction: number,
): number {
  const ratio =
    1.6 +
    5.1 * eccentricity -
    2.22 * eccentricity * eccentricity +
    4.12 * companionMassFraction -
    4.27 * companionMassFraction * eccentricity -
    5.09 * companionMassFraction * companionMassFraction +
    4.61 *
      companionMassFraction *
      companionMassFraction *
      eccentricity *
      eccentricity;

  return binarySemiMajorAxisAu * ratio;
}

export function estimateStarLuminosityFromMass(solarMasses: number): number {
  if (solarMasses <= 0.43) {
    return 0.23 * Math.pow(solarMasses, 2.3);
  }

  if (solarMasses <= 2) {
    return Math.pow(solarMasses, 4);
  }

  if (solarMasses <= 20) {
    return 1.5 * Math.pow(solarMasses, 3.5);
  }

  return 3200 * solarMasses;
}

export function randomAngleDegrees(): number {
  return Math.random() * 360;
}

export function normalizeAngleDegrees(angleDegrees: number): number {
  const normalized = angleDegrees % 360;

  return normalized < 0 ? normalized + 360 : normalized;
}

export function toRomanNumeral(value: number): string {
  const numerals = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ] as const;
  let remaining = value;
  let result = '';

  for (const [symbol, numericValue] of numerals) {
    while (remaining >= numericValue) {
      result += symbol;
      remaining -= numericValue;
    }
  }

  return result;
}

export function calculateSurfaceGravity(
  mass: Mass,
  meanRadius: Length,
): Acceleration {
  const radiusInMeters = Number(meanRadius.value) * KILOMETERS_TO_METERS;

  return new Acceleration(
    (GRAVITATIONAL_CONSTANT * Number(mass.value)) /
      (radiusInMeters * radiusInMeters),
  );
}

export function calculateEscapeVelocity(
  mass: Mass,
  meanRadius: Length,
): Velocity {
  const radiusInMeters = Number(meanRadius.value) * KILOMETERS_TO_METERS;

  return new Velocity(
    Math.sqrt(
      (2 * GRAVITATIONAL_CONSTANT * Number(mass.value)) / radiusInMeters,
    ),
  );
}
