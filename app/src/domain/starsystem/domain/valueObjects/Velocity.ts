import { ValueObject } from './ValueObject';

export class Velocity extends ValueObject<number> {
  public readonly unit = 'm/s';

  public getAsKmPerHour(): number {
    return this.value * 3.6;
  }

  public override toJSON(): object {
    return {
      value: this.value,
      kmPerHour: this.getAsKmPerHour(),
    };
  }
}
