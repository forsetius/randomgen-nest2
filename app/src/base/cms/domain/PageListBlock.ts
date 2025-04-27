import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageListBlockDef } from '../types';
import { Locale } from '@shared/types/Locale';
import { Page } from './Page';
import { PageLib } from './PageLib';

export class PageListBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: PageListBlockDef,
    locale: Locale,
    public override readonly parentSlug: string,
  ) {
    super(name, def, locale, parentSlug);
  }

  preRender(pages: PageLib): void {
    const targetPages = pages.getPagesByDate(
      this.parentSlug,
      this.def.prev,
      this.def.next,
    );

    const pageDefs = {
      prev: targetPages.prev.map((page: Page) => page.parseMarkdown()),
      next: targetPages.next.map((page: Page) => page.parseMarkdown()),
    };

    this._content = this.templatingService.render(
      this.template,
      { pages: pageDefs },
      this.locale,
    );
  }
}
