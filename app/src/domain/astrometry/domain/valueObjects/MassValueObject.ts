import { BaseValueObject } from './BaseValueObject';

export class MassValueObject extends BaseValueObject<MassUnit> {
  public constructor(value: number, unit: MassUnit = 'kg') {
    const units: { unit: MassUnit; value: number }[] = [
      { unit: 'kg', value: 1 },
      { unit: 't', value: 1e3 },
      { unit: 'Me', value: 5.972168e24 },
      { unit: 'Mj', value: 1.89819e27 },
      { unit: 'Ms', value: 1.9855e30 },
    ];

    super(value, unit, units);
  }
}

export type MassUnit = 'kg' | 't' | 'Me' | 'Mj' | 'Ms';
