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
    const items = library.tags.get(this.def.tag);
    if (!items) {
      throw new Error(`Tag ${this.def.tag} not found`);
    }

    this._content = this.templatingService.render(this.template, {
      cardTemplate: this.def.cardTemplate,
      items,
    });
  }
}
