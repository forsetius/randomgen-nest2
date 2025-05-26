import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { GalleryBlockDef } from '../../types';

export class SeriesBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: GalleryBlockDef,
  ) {
    super(name, def);
  }

  render(): void {
    this._content = this.templatingService.render(this.template, {
      cardTemplate: this.def.cardTemplate,
      series: this.def.series,
    });
  }
}
