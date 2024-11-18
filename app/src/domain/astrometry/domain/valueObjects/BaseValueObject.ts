export abstract class BaseValueObject<U extends string> {
  public readonly units: UnitValue<U>[];
  public readonly value: number;
  public readonly scaled: { value: number; unit: U };

  constructor(value: number, unit: U, units: UnitValue<U>[]) {
    this.units = units;
    this.value = value * this.getMultiplier(unit);

    this.scaled = units
      .map((def) => ({
        unit: def.unit,
        value: Math.abs(Math.log10(this.value / def.value)),
      }))
      .sort((a, b) => a.value - b.value)
      .shift()!;
  }

  public get(unit: U): number {
    return this.value / this.getMultiplier(unit);
  }

  protected getMultiplier(unit: U): number {
    return this.units.find((def) => def.unit === unit)!.value;
  }
}

export type UnitValue<U> = { unit: U; value: number };
