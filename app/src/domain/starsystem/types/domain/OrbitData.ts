import { Length, Period } from '../../domain/valueObjects';
import { Orbital } from './Orbital';

export interface OrbitData {
  semiMajorAxis: Length;
  eccentricity: number; // 0..1
  inclination: number; // degrees
  orbitalPeriod: Period;
  orbitals: Orbital[];
}
