import { TemplatingService } from '@templating/TemplatingService';
import { MenuDef } from '../types';
import { Locale } from '@shared/types/Locale';

export class Menu {
  private _content = '';

  public constructor(
    private templatingService: TemplatingService,
    public readonly name: string,
    private def: MenuDef,
    private locale: Locale,
  ) {}

  get content(): string {
    return this._content;
  }

  public preRender(): void {
    try {
      this._content = this.templatingService.render(
        this.def.template,
        this.def,
        this.locale,
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw new Error(
          `Error rendering menu "${this.name}": ${e.message}\n${this.def.template}`,
        );
      }
      throw new Error(`Error rendering menu "${this.name}"`);
    }
  }
}
