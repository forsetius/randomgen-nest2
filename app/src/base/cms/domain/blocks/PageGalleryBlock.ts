import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { Library } from '../Library';
import { MarkdownService } from '../../../parser/services/MarkdownService';
import { PageGalleryBlockDef } from '../../types';

export class PageGalleryBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    private readonly markdownService: MarkdownService,
    name: string,
    public override readonly def: PageGalleryBlockDef,
  ) {
    super(name, def);
  }

  render(library: Library): void {
    const sources = this.def.sources;
    const items = sources
      .map((sourceDef) => {
        if ('category' in sourceDef) {
          return this.getCategoryData(
            sourceDef.category,
            sourceDef.subcategory,
            library,
          );
        }
        if ('items' in sourceDef) {
          return sourceDef.items;
        }
        if ('tag' in sourceDef) {
          return this.getTagData(sourceDef.tag, library);
        }
        throw new Error(`Unknown source type`);
      })
      .flat();

    this._content = this.templatingService.render(this.template, {
      blockId: this.name,
      cardTemplate: this.def.cardTemplate,
      items,
      perPage: this.def.count,
      perRow: this.def.columns,
      title: this.def.title,
      content: this.def.content
        ? this.markdownService.parseInline(this.def.content)
        : undefined,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }

  private getCategoryData(
    categoryName: string,
    subcategoryName: string | undefined,
    library: Library,
  ) {
    const category = library.categories.get(categoryName);
    if (!category) {
      throw new Error(`Category ${categoryName} not found`);
    }
    const items = category.getPages(subcategoryName).map((page) => page.slug);

    if (this.def.sortDir === 'desc') {
      items.reverse();
    }

    return items;
  }

  private getTagData(tag: string, library: Library) {
    const tagPages = library.tags.get(tag);
    if (!tagPages) {
      throw new Error(`Tag ${tag} not found`);
    }

    return [...tagPages].map((page) => page.slug);
  }
}
