import { Injectable } from '@nestjs/common';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { TemplatingService } from '@templating/TemplatingService';
import { Page } from '../domain/Page';
import { PageDef, PageZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { BlockFactory } from './BlockFactory';
import { fromZodError } from '@shared/util/fromZodError';
import { Locale } from '@shared/types/Locale';

@Injectable()
export class PageFactory {
  public constructor(
    private readonly blockFactory: BlockFactory,
    private readonly markdownService: MarkdownService,
    private readonly templatingService: TemplatingService,
  ) {}

  public validate(filename: string, def: unknown): PageDef {
    try {
      return PageZodSchema.parse(def);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new SourceFileValidationException(filename, fromZodError(e));
      }

      throw e;
    }
  }

  public createAll(pageDefs: Map<string, unknown>, lang: Locale): Page[] {
    return Array.from(pageDefs).map(([source, def]) => {
      return this.create(source, def, lang);
    });
  }

  public create(filename: string, def: unknown, lang: Locale): Page {
    const pageDef: PageDef = this.validate(filename, def);

    return new Page(
      this.blockFactory,
      this.markdownService,
      this.templatingService,
      filename,
      pageDef,
      lang,
    );
  }
}
