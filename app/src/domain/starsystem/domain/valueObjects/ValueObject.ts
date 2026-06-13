export abstract class ValueObject<T> {
  public abstract readonly unit: string;

  public constructor(public readonly value: T) {}

  public isEqual(other: ValueObject<T>): boolean {
    return other.unit === this.unit && other.value === this.value;
  }

  public abstract toJSON(): object;
}
