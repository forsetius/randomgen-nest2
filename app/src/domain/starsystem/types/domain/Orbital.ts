import {
  Acceleration,
  Length,
  Mass,
  Period,
  Velocity,
} from '../../domain/valueObjects';

export interface Orbital {
  semiMajorAxis: Length;
  excentricity: number; // 0..1
  inclination: number; // degrees
  orbitalPeriod: Period;
}

export interface CelestialBody {
  mass: Mass;
  radius: Length;
  equatorialGravity: Acceleration;
  escapeVelocity: Velocity;
  rotationPeriod: Period;
}

export interface DistributedObject {
  width: Length;
}
