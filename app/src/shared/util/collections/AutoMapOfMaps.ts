/**
 * A Map that for each key of type N stores an array of values of type T.
 * It automatically creates an array for each new key, both when adding values
 * and when retrieving the collection for a key.
 */
export class AutoMapOfMaps<O, I, V> extends Map<O, Map<I, V>> {
  private addMissingCollection(key: O): void {
    if (!this.has(key)) {
      this.set(key, new Map<I, V>());
    }
  }

  /**
   * Adds a value to the array stored under the given key.
   * If the key does not exist, it will be created.
   *
   * @param outerKey
   * @param innerKey
   * @param value to add to an array
   */
  public add(outerKey: O, innerKey: I, value: V): void {
    this.addMissingCollection(outerKey);
    this.get(outerKey)!.set(innerKey, value);
  }

  /**
   * Retrieves the array of values stored under the given key.
   * If the key does not exist, it will be created and an empty array returned.
   *
   * @param key
   * @returns array of values for the key
   */
  public getCollection(key: O): Map<I, V> {
    this.addMissingCollection(key);

    return this.get(key)!;
  }
}
