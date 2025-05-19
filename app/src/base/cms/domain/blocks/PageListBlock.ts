import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageListBlockDef } from '../../types';
import { Page } from '../Page';
import { Library } from '../Library';

export class PageListBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: PageListBlockDef,
    public readonly parentSlug: string,
  ) {
    super(name, def);
  }

  render(pages: Library): void {
    const targetPages = pages.getPagesFromSeries(
      this.def.series,
      this.parentSlug,
      this.def.prev,
      this.def.next,
    );

    const prev = targetPages.prev.map((page: Page) => page.data);
    const next = targetPages.next.map((page: Page) => page.data);
    const pageDefs = { prev, next, all: prev.concat(next) };

    this._content = this.templatingService.render(this.template, {
      title: this.def.title,
      pages: pageDefs,
    });
  }
}
