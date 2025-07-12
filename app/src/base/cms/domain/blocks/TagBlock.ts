import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { TagBlockDef } from '../../types';
import { Library } from '../Library';
import { MarkdownService } from '../../../parser/services/MarkdownService';

export class TagBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    private readonly markdownService: MarkdownService,
    name: string,
    public override readonly def: TagBlockDef,
  ) {
    super(name, def);
  }

  render(library: Library): void {
    const tagPages = library.tags.get(this.def.tag);
    if (!tagPages) {
      throw new Error(`Tag ${this.def.tag} not found`);
    }
    const items = [...tagPages].map((page) => page.slug);
    if (this.def.sortDir === 'desc') {
      items.reverse();
    }

    this._content = this.templatingService.render(this.template, {
      blockId: this.name,
      cardTemplate: this.def.cardTemplate,
      items,
      perPage: this.def.count,
      perRow: this.def.columns,
      category: this.def.tag,
      title: this.def.title,
      content: this.def.content
        ? this.markdownService.parseInline(this.def.content)
        : undefined,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
