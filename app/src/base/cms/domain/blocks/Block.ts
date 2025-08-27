import { BlockDef } from '../../types';
import { Library } from '../Library';

export abstract class Block {
  protected _content?: string;

  protected constructor(
    public readonly name: string,
    public readonly def: BlockDef,
  ) {}

  get template(): string {
    return this.def.template;
  }

  /**
   * @throws {Error} if the block is not rendered yet
   */
  get content(): string {
    if (typeof this._content === 'undefined') {
      throw new Error(
        `Tried to get content of page ${this.name} that's not rendered yet`,
      );
    }
    return this._content;
  }

  public abstract render(library: Library): void;
}
