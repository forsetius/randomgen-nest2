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
    const items = library.categories.get(this.def.category);
    if (!items) {
      throw new Error(`Category ${this.def.category} not found`);
    }

    this._content = this.templatingService.render(this.template, {
      cardTemplate: this.def.cardTemplate,
      items,
    });
  }
}
