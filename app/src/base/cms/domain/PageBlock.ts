import { Block } from './Block';
import { PageBlockDef, PageDef } from '../types';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';
import { PageLib } from './PageLib';

export class PageBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: PageBlockDef,
    locale: Locale,
    public override readonly parentSlug: string,
  ) {
    super(name, def, locale, parentSlug);
  }

  preRender(pages: PageLib): void {
    const page = pages.getPage(this.def.slug);

    const def: PageDef = page.parseMarkdown();
    this._content = this.templatingService.render(
      this.template,
      def,
      this.locale,
    );
  }
}
