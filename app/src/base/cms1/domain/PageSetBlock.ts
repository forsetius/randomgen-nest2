import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageDef, PageSetBlockDef } from '../types';
import { Locale } from '@shared/types/Locale';
import { Page } from './Page';
import { PageLib } from './PageLib';

export class PageSetBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    public override readonly def: PageSetBlockDef,
    public override readonly locale: Locale,
  ) {
    super(def, locale);
  }

  preRender(pages: PageLib): void {
    const targetPages = this.def.items.map((slug) => pages.getPage(slug));

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
