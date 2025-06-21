import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { CategoryBlockDef } from '../../types';
import { Library } from '../Library';

export class CategoryBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
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
    const items = [...category.getPages().map((page) => page.slug)];
    if (this.def.sortDir === 'desc') {
      items.reverse();
    }

    this._content = this.templatingService.render(this.template, {
      blockId: this.name,
      cardTemplate: this.def.cardTemplate,
      items,
      perPage: this.def.count,
      category: this.def.category,
      title: this.def.title,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
