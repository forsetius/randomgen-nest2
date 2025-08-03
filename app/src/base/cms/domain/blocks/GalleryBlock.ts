import { Block } from './Block';
import { GalleryBlockDef } from '../../types';
import { TemplatingService } from '@templating/TemplatingService';
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
      ...this.def,
      blockId: this.name,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
