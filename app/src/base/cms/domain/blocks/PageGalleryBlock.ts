import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { Library } from '../Library';
import { MarkdownService } from '../../../parser/services/MarkdownService';
import { PageGalleryBlockDef } from '../../types';
import { CategoryNotFoundException } from '../../exceptions/CategoryNotFoundException';

export class PageGalleryBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    private readonly markdownService: MarkdownService,
    name: string,
    public override readonly def: PageGalleryBlockDef,
  ) {
    super(name, def);
  }

  /**
   * @throws {Error} if the block is not rendered yet
   * @throws {Error} if the category is not found in the library
   * @throws {Error} if the tag is not found in the library
   */
  public render(library: Library): void {
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

  /**
   *
   * @throws {Error} if the category is not found in the library
   */
  private getCategoryData(
    categoryName: string,
    subcategoryName: string | undefined,
    library: Library,
  ) {
    const category = library.categories.get(categoryName);
    if (!category) {
      throw new CategoryNotFoundException(categoryName, library.locale.lang);
    }
    const items = category.getPages(subcategoryName).map((page) => page.slug);

    return this.def.sortDir === 'desc' ? items.reverse() : items;
  }

  /**
   * @throws {Error} if the tag is not found in the library
   */
  private getTagData(tag: string, library: Library) {
    const tagPages = library.tags.get(tag);
    if (!tagPages) {
      throw new Error(`Tag ${tag} not found`);
    }

    return [...tagPages].map((page) => page.slug);
  }
}
