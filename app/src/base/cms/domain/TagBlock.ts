import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageDef, TagBlockDef } from '../types';
import { Locale } from '@shared/types/Locale';
import { Page } from './Page';
import { PageLib } from './PageLib';

export class TagBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: TagBlockDef,
    locale: Locale,
    public override readonly parentSlug: string,
  ) {
    super(name, def, locale, parentSlug);
  }

  preRender(pages: PageLib): void {
    const targetPages = pages.getPagesByTag(this.def.tag);

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
