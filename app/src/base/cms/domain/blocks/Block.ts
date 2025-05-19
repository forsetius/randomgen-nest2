import { BlockDef } from '../../types';
import { Library } from '../Library';

export abstract class Block {
  protected _content?: string;

  public constructor(
    public readonly name: string,
    public readonly def: BlockDef,
  ) {}

  get template(): string {
    return this.def.template;
  }

  get content(): string {
    if (typeof this._content === 'undefined') {
      throw new Error(`Page ${this.name} is not rendered yet`);
    }
    return this._content;
  }

  public abstract render(pages: Library): void;
}
