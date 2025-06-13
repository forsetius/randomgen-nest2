import { Block } from './Block';
import { StaticBlockDef } from '../../types';
import { TemplatingService } from '@templating/TemplatingService';
import { MarkdownService } from '../../../parser/services/MarkdownService';
import { Library } from '../Library';

export class StaticBlock extends Block {
  public constructor(
    private readonly markdownService: MarkdownService,
    private readonly templatingService: TemplatingService,
    name: string,
    public override readonly def: StaticBlockDef,
  ) {
    super(name, def);
  }

  render(library: Library): void {
    const content = this.markdownService.parse(this.def.content);
    this._content = this.templatingService.render(this.template, {
      content,
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
