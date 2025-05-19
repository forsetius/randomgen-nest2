import { Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { MenuDef, MenuZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Menu } from '../domain/Menu';
import { fromZodError } from '@shared/util/fromZodError';

@Injectable()
export class MenuFactory {
  public constructor(private templatingService: TemplatingService) {}

  public validate(filename: string, def: unknown): MenuDef {
    try {
      return MenuZodSchema.parse(def);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new SourceFileValidationException(filename, fromZodError(e));
      }

      throw e;
    }
  }

  public createAll(menuDefs: Map<string, unknown>): Map<string, Menu> {
    return new Map(
      Array.from(menuDefs).map(([source, def]) => {
        const menuDef: MenuDef = this.validate(source, def);

        return [source, this.create(source, menuDef)];
      }),
    );
  }

  public create(name: string, def: MenuDef): Menu {
    return new Menu(this.templatingService, name, def);
  }
}
