import { CelestialBody, Orbital } from '../types/domain/Orbital';
import { Acceleration, Length, Mass, Period, Velocity } from './valueObjects';

export class Star implements Orbital, CelestialBody {
  semiMajorAxis: Length;
  excentricity: number;
  inclination: number;
  orbitalPeriod: Period;
  mass: Mass;
  radius: Length;
  equatorialGravity: Acceleration;
  escapeVelocity: Velocity;
  rotationPeriod: Period;
}
