import { SpectralClass } from '../types/SpectralClass';
import { MassValueObject } from './valueObjects/MassValueObject';
import { OrbitType } from '../types/OrbitType';

export class Star {
  public mass: MassValueObject;
  public spectralClass: SpectralClass;
  public placement: OrbitType;
}
