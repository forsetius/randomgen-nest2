type Entries<T> = {
  [K in keyof T]-?: [K, NonNullable<T[K]>];
}[keyof T][];

export function keys<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}

/**
 * Typed Object.entries that strips out nullish values for safer downstream usage.
 */
export function entries<T extends object>(object: T): Entries<T> {
  return (Object.entries(object) as [keyof T, T[keyof T]][]).filter(
    (entry): entry is Entries<T>[number] => entry[1] != null,
  );
}
