import { Block } from './Block';
import { MediaBlockDef } from '../../types';
import { TemplatingService } from '@templating/TemplatingService';

export class MediaBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: MediaBlockDef,
  ) {
    super(name, def);
  }

  render(): void {
    this._content = this.templatingService.render(this.template, this.def);
  }
}
