import { Tag } from './Tag';

export class TagCollection {
  private readonly tags: readonly Tag[];

  public constructor(values: readonly string[]) {
    this.tags = values.map((rawTag) => new Tag(rawTag));
  }

  public any(patterns: readonly string[]): boolean {
    return patterns.some((pattern) => this.tags.some((tag) => tag.is(pattern)));
  }

  public all(patterns: readonly string[]): boolean {
    return patterns.every((pattern) =>
      this.tags.some((tag) => tag.is(pattern)),
    );
  }

  public none(patterns: readonly string[]): boolean {
    return patterns.every((pattern) =>
      this.tags.every((tag) => !tag.is(pattern)),
    );
  }

  public has(pattern: string): boolean {
    return this.tags.some((tag) => tag.is(pattern));
  }

  public raw(): readonly string[] {
    return this.tags.map((t) => t.value);
  }
}
