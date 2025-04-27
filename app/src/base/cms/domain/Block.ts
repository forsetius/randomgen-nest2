import { BlockDef } from '../types';
import { Locale } from '@shared/types/Locale';
import { PageLib } from './PageLib';

export abstract class Block {
  protected _content?: string;

  public constructor(
    public readonly name: string,
    public readonly def: BlockDef,
    public readonly locale: Locale,
    public readonly parentSlug: string | null,
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

  public abstract preRender(pages: PageLib): void;
}
