import { Block } from './Block';
import { StaticBlockDef } from '../types';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';
import { MarkdownService } from '../../parser/services/MarkdownService';

export class StaticBlock extends Block {
  public constructor(
    private readonly markdownService: MarkdownService,
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: StaticBlockDef,
    locale: Locale,
    parentSlug: string | null,
  ) {
    super(name, def, locale, parentSlug);
  }

  preRender(): void {
    const content = this.markdownService.parse(this.def.content);
    this._content = this.templatingService.render(
      this.template,
      { content },
      this.locale,
    );
  }
}
