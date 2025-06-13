import { Block } from './Block';
import { MediaBlockDef } from '../../types';
import { TemplatingService } from '@templating/TemplatingService';
import { Library } from '../Library';

export class MediaBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: MediaBlockDef,
  ) {
    super(name, def);
  }

  render(library: Library): void {
    this._content = this.templatingService.render(this.template, {
      ...this.def,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
