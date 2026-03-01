/**
 * A Map that for each key of type N stores an array of values of type T.
 * It automatically creates an array for each new key, both when adding values
 * and when retrieving the collection for a key.
 */
export class AutoArrayMap<N, T> extends Map<N, T[]> {
  private addMissingCollection(key: N): void {
    if (!this.has(key)) {
      this.set(key, []);
    }
  }

  /**
   * Adds a value to the array stored under the given key.
   * If the key does not exist, it will be created.
   *
   * @param key
   * @param value to add to an array
   */
  public add(key: N, value: T): void {
    this.addMissingCollection(key);
    this.get(key)!.push(value);
  }

  /**
   * Retrieves the array of values stored under the given key.
   * If the key does not exist, it will be created and an empty array returned.
   *
   * @param key
   * @returns array of values for the key
   */
  public getCollection(key: N): T[] {
    this.addMissingCollection(key);

    return this.get(key)!;
  }
}
