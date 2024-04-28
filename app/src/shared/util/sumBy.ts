import { PickByType } from '../types/PickByType';

export function sumBy<T>(
  collection: T[],
  field: keyof PickByType<T, number>,
): number {
  return collection.reduce(
    (sum, currentValue) => sum + (currentValue[field] as number),
    0,
  );
}
