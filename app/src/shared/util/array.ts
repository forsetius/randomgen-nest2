export const getLast = <T>(array: T[] | undefined) => {
  if (!array?.length) return undefined;

  return array[array.length - 1];
};

export function findDuplicates(items: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const item of items) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
}
