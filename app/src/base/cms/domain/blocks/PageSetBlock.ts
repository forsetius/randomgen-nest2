import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageSetBlockDef } from '../../types';
import { Library } from '../Library';

export class PageSetBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: PageSetBlockDef,
  ) {
    super(name, def);
  }

  render(library: Library): void {
    this._content = this.templatingService.render(this.template, {
      cardTemplate: this.def.cardTemplate,
      items: this.def.items,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
