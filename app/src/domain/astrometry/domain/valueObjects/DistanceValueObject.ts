import { BaseValueObject } from './BaseValueObject';

export class DistanceValueObject extends BaseValueObject<DistanceUnit> {
  public constructor(value: number, unit: DistanceUnit = 'm') {
    const units: { unit: DistanceUnit; value: number }[] = [
      { unit: 'm', value: 1 },
      { unit: 'km', value: 1_000 },
      { unit: 'R♁', value: 6_371_000 },
      { unit: 'R♃', value: 71_492_000 },
      { unit: 'R☉', value: 696_300_000 },
      { unit: 'AU', value: 149_597_871_000 },
      { unit: 'LY', value: 9_460_528_400e6 },
    ];

    super(value, unit, units);
  }
}

export type DistanceUnit = 'm' | 'km' | 'R♁' | 'R♃' | 'R☉' | 'AU' | 'LY';
