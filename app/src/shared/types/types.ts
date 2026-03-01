export type JsPrimitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;

/**
 * Get the property names of an object that are "keyable".
 *
 * Keyable types can be used as a key in a map or an object literal.
 *
 * @example
 * type T = { a: string, b: number, o: object, f: () => void }
 * type K = KeyablePropertyNames<T> // "a" | "b"
 */
export type KeyablePropertyNames<T extends object> = {
  [K in keyof T]-?: Extract<T[K], PropertyKey> extends never ? never : K;
}[keyof T];
