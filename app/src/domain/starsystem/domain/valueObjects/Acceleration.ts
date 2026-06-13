import { ValueObject } from './ValueObject';

export const EARTH_GRAVITY = 9.80665;

export class Acceleration extends ValueObject<number> {
  public readonly unit = 'm/s^2';

  public getAsEarthG(): number {
    return this.value / EARTH_GRAVITY;
  }

  public override toJSON(): object {
    return {
      value: this.value,
      earthG: this.getAsEarthG(),
    };
  }
}
