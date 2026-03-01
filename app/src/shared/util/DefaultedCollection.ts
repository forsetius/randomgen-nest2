export class DefaultedCollection<T> {
  private store = new Map<string, T>();

  public constructor(private defaultElement: string) {}

  public set(name: string, element: T): void {
    this.store.set(name, element);
  }

  public get(name: string): T {
    if (this.store.has(name)) {
      return this.store.get(name)!;
    }

    return this.store.get(this.defaultElement)!;
  }
}
