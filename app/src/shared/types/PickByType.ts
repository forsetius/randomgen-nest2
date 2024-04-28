/**
 * Get an object made of all the keys from type T that are of type V
 *
 * Example: if X = { a: string, b: number } then PickByType<X, string> gives { a: string }
 */
export type PickByType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};
