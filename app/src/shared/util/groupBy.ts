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
