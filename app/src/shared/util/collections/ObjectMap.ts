import { KeyablePropertyNames } from '@shared/types/types';

export class ObjectMap<
  V extends object,
  U extends KeyablePropertyNames<V>,
  K extends PropertyKey = Extract<V[U], PropertyKey>,
> implements Iterable<V> {
  private readonly store = new Map<K, V>();

  public static create<
    V extends object,
    U extends KeyablePropertyNames<V> = KeyablePropertyNames<V>,
  >(uniqueKey: U): ObjectMap<V, U> {
    return new ObjectMap<V, U>(uniqueKey);
  }

  constructor(
    private readonly uniqueKey: U,
    initialValues?: Iterable<V>,
  ) {
    if (initialValues) this.addMany(initialValues);
  }

  public get size(): number {
    return this.store.size;
  }

  public clear(): void {
    this.store.clear();
  }

  public add(value: V): void {
    this.store.set(this.getKey(value), value);
  }

  public addMany(values: Iterable<V>): void {
    for (const value of values) this.add(value);
  }

  public has(key: K): boolean {
    return this.store.has(key);
  }

  public hasValue(value: V): boolean {
    return this.store.has(this.getKey(value));
  }

  public get(key: K): V | undefined {
    return this.store.get(key);
  }

  public delete(key: K): boolean {
    return this.store.delete(key);
  }

  public deleteValue(value: V): boolean {
    return this.delete(this.getKey(value));
  }

  public keys(): IterableIterator<K> {
    return this.store.keys();
  }

  public values(): IterableIterator<V> {
    return this.store.values();
  }

  public entries(): IterableIterator<[K, V]> {
    return this.store.entries();
  }

  public forEach(callbackFn: (value: V, key: K, map: Map<K, V>) => void): void {
    this.store.forEach(callbackFn);
  }

  public [Symbol.iterator](): IterableIterator<V> {
    return this.store.values();
  }

  private getKey(value: V): K {
    const key = value[this.uniqueKey];

    if (!['string', 'number', 'symbol'].includes(typeof key)) {
      throw new TypeError(
        `KeyedSet: value of property "${String(this.uniqueKey)}" must be string|number|symbol`,
      );
    }

    return key as K;
  }
}
