import { Star } from './Star';

export class StarSystem {
  public age = 0;
  public center: Star[] = [];
  public orbits: Orbit[] = [];
  public satellites: StarSystem[] = [];
}
