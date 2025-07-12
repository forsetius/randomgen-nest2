import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { CategoryBlockDef } from '../../types';
import { Library } from '../Library';
import { MarkdownService } from '../../../parser/services/MarkdownService';

export class CategoryBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    private readonly markdownService: MarkdownService,
    name: string,
    public override readonly def: CategoryBlockDef,
  ) {
    super(name, def);
  }

  render(library: Library): void {
    const category = library.categories.get(this.def.category);
    if (!category) {
      throw new Error(`Category ${this.def.category} not found`);
    }
    const items = category
      .getPages(this.def.subcategory)
      .map((page) => page.slug);

    if (this.def.sortDir === 'desc') {
      items.reverse();
    }

    this._content = this.templatingService.render(this.template, {
      blockId: this.name,
      cardTemplate: this.def.cardTemplate,
      items,
      perPage: this.def.count,
      perRow: this.def.columns,
      category: this.def.category,
      title: this.def.title,
      content: this.def.content
        ? this.markdownService.parseInline(this.def.content)
        : undefined,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
