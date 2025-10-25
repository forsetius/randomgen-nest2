import type { JsPrimitive } from '@shared/types/types';
import type { PickByType } from '../types/PickByType';

export const getLast = <T>(array: T[] | undefined) => {
  if (!array?.length) return undefined;

  return array[array.length - 1];
};

export function findDuplicates<T extends JsPrimitive>(items: T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();

  for (const item of items) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
}

export function groupBy<T>(
  collection: T[],
  getter: (item: T) => string,
): Record<string, T[]> {
  const grouping: Record<string, T[]> = {};

  collection.forEach((item) => {
    const discriminator = getter(item);
    if (!(discriminator in grouping)) {
      grouping[discriminator] = [];
    }

    grouping[discriminator]?.push(item);
  });

  return grouping;
}

export function sumBy<T>(
  collection: T[],
  field: keyof PickByType<T, number>,
): number {
  return collection.reduce(
    (sum, currentValue) => sum + (currentValue[field] as number),
    0,
  );
}
