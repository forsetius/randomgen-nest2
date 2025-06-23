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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { template, type, content, ...rest } = this.def;

    this._content = this.templatingService.render(template, {
      ...rest,
      content: this.markdownService.parse(content),
      lang: library.locale.lang,
      translations: library.locale.translations,
    });
  }
}
