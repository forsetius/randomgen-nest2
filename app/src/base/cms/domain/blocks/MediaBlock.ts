import { Block } from './Block';
import { MediaBlockDef } from '../../types';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';

export class MediaBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: MediaBlockDef,
    locale: Locale,
    public override readonly parentSlug: string,
  ) {
    super(name, def, locale, parentSlug);
  }

  preRender(): void {
    this._content = this.templatingService.render(
      this.template,
      this.def,
      this.locale,
    );
  }
}
