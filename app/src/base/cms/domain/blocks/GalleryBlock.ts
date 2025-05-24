import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { GalleryBlockDef } from '../../types';
import { Library } from '../Library';

export class GalleryBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: GalleryBlockDef,
  ) {
    super(name, def);
  }

  render(library: Library): void {
    this._content = this.templatingService.render(this.template, {
      lang: library.locale,
      cardTemplate: this.def.cardTemplate,
      series: this.def.series,
    });
  }
}
