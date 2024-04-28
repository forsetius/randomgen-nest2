export function groupBy<T>(
  collection: T[],
  getter: (item: T) => string,
): { [key: string]: T[] } {
  const grouping: { [key: string]: T[] } = {};

  collection.forEach((item) => {
    const discriminator = getter(item);
    if (!(discriminator in grouping)) {
      grouping[discriminator] = [];
    }

    grouping[discriminator]?.push(item);
  });

  return grouping;
}
