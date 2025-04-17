import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageDef, PageListBlockDef } from '../types';
import { Locale } from '@shared/types/Locale';
import { Page } from './Page';
import { PageLib } from './PageLib';

export class PageListBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: PageListBlockDef,
    locale: Locale,
  ) {
    super(name, def, locale);
  }

  preRender(pages: PageLib): void {
    const targetPages = pages.getPagesByDate(this.def.count, this.def.skip);

    const pageDefs: PageDef[] = targetPages.map((page: Page) =>
      page.parseMarkdown(),
    );
    this._content = this.templatingService.render(
      this.template,
      { pages: pageDefs },
      this.locale,
    );
  }
}
