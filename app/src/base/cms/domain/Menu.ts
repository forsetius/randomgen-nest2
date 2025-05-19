import { TemplatingService } from '@templating/TemplatingService';
import { MenuDef } from '../types';

export class Menu {
  private _content = '';

  public constructor(
    private templatingService: TemplatingService,
    public readonly name: string,
    private def: MenuDef,
  ) {}

  get content(): string {
    return this._content;
  }

  public render(): void {
    try {
      this._content = this.templatingService.render(
        this.def.template,
        this.def,
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
