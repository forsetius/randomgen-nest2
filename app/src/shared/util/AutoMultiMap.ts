export class AutoMultiMap<N, T> extends Map<N, T[]> {
  private addMissingCollection(key: N): void {
    if (!this.has(key)) {
      this.set(key, []);
    }
  }

  public add(key: N, value: T): void {
    this.addMissingCollection(key);
    this.get(key)!.push(value);
  }

  public getCollection(key: N): T[] {
    this.addMissingCollection(key);

    return this.get(key)!;
  }
}
