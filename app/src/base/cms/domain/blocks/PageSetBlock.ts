import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageSetBlockDef } from '../../types';
import { Library } from '../Library';
import { MarkdownService } from '../../../parser/services/MarkdownService';

export class PageSetBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    private readonly markdownService: MarkdownService,
    name: string,
    public override readonly def: PageSetBlockDef,
  ) {
    super(name, def);
  }

  render(library: Library): void {
    this._content = this.templatingService.render(this.template, {
      blockId: this.name,
      cardTemplate: this.def.cardTemplate,
      items: this.def.items,
      perPage: this.def.count,
      perRow: this.def.columns,
      title: this.def.title,
      content: this.def.content
        ? this.markdownService.parse(this.def.content)
        : undefined,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
