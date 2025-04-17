import { Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { MenuDef, MenuZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { Locale } from '@shared/types/Locale';
import { Menu } from './Menu';

@Injectable()
export class MenuFactory {
  public constructor(private templatingService: TemplatingService) {}

  public validate(filename: string, def: unknown): MenuDef {
    try {
      return MenuZodSchema.parse(def);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new SourceFileValidationException(filename, e);
      }

      throw e;
    }
  }

  public create(name: string, def: MenuDef, locale: Locale): Menu {
    return new Menu(this.templatingService, name, def, locale);
  }
}
