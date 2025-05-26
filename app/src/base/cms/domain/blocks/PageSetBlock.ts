import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { PageSetBlockDef } from '../../types';

export class PageSetBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: PageSetBlockDef,
  ) {
    super(name, def);
  }

  render(): void {
    this._content = this.templatingService.render(this.template, {
      cardTemplate: this.def.cardTemplate,
      items: this.def.items,
    });
  }
}
