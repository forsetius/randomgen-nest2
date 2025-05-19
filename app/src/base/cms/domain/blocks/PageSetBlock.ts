import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageDef, PageSetBlockDef } from '../../types';
import { Page } from '../Page';
import { Library } from '../Library';

export class PageSetBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: PageSetBlockDef,
  ) {
    super(name, def);
  }

  render(pages: Library): void {
    const targetPages = this.def.items.map((slug) => pages.getPage(slug));
    const pageDefs: PageDef[] = targetPages.map((page: Page) => page.data);

    this._content = this.templatingService.render(this.template, {
      pages: pageDefs,
    });
  }
}
