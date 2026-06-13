import { Length, Period } from './valueObjects';
import { Orbital } from '../types/domain/Orbital';

export class Orbit {
  semiMajorAxis: Length;
  eccentricity: number; // 0..1
  inclination: number; // degrees
  orbitalPeriod: Period;
  orbitals: Orbital[];
}
