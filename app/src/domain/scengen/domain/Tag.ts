export class Tag {
  private readonly segments: readonly string[];

  public constructor(public readonly value: string) {
    this.segments = value.split(':');
  }

  /**
   * Exact match or namespace match.
   *
   * @example tag.is('mind') -> true for 'mind:augmentation:nootropics'
   * @example tag.is('mind:augmentation') -> true
   * @example tag.is('mind:augmentation:*') -> true
   * @example tag.is('mind:emulation') -> false
   */
  public is(pattern: string): boolean {
    if (pattern.endsWith(':*')) {
      const prefix = pattern.slice(0, -2);
      return this.value === prefix || this.value.startsWith(`${prefix}:`);
    }

    const patternSegments = pattern.split(':');

    if (patternSegments.length > this.segments.length) {
      return false;
    }

    for (let i = 0; i < patternSegments.length; i++) {
      if (this.segments[i] !== patternSegments[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * True if this tag is a child of a given namespace.
   */
  public isUnder(namespace: string): boolean {
    return this.is(`${namespace}:*`);
  }

  /**
   * Returns immediate parent namespace, if any.
   *
   * @example 'mind:augmentation:nootropics' -> 'mind:augmentation'
   */
  public parent(): string | null {
    if (this.segments.length <= 1) return null;

    return this.segments.slice(0, -1).join(':');
  }

  /**
   * Returns all ancestor namespaces.
   *
   * @example 'mind:tech:nootropics' -> ['mind', 'mind:tech']
   */
  public ancestors(): string[] {
    const result: string[] = [];
    for (let i = 1; i < this.segments.length; i++) {
      result.push(this.segments.slice(0, i).join(':'));
    }
    return result;
  }
}
