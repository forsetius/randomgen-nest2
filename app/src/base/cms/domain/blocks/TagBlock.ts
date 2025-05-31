import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { TagBlockDef } from '../../types';
import { Library } from '../Library';

export class TagBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
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
      cardTemplate: this.def.cardTemplate,
      items,
      perPage: this.def.count,
    });
  }
}
