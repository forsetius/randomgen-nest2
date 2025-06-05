import { Block } from './Block';
import { TemplatingService } from '@templating/TemplatingService';
import { ApiCallBlockDef } from '../../types';

export class ApiCallBlock extends Block {
  public constructor(
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: ApiCallBlockDef,
  ) {
    super(name, def);
  }

  render(): void {
    this._content = this.templatingService.render(this.template, {
      title: this.def.title,
      url: this.def.url,
    });
  }
}
