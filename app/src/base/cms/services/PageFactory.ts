import { Injectable } from '@nestjs/common';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';
import { Page } from '../domain/Page';
import { PageDef, PageZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { BlockFactory } from './BlockFactory';
import { AppConfigService } from '@config/AppConfigService';
import { fromZodError } from '@shared/util/fromZodError';

@Injectable()
export class PageFactory {
  public constructor(
    private readonly blockFactory: BlockFactory,
    private readonly configService: AppConfigService,
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

  public create(filename: string, def: PageDef, locale: Locale): Page {
    return new Page(
      this.blockFactory,
      this.markdownService,
      this.templatingService,
      filename,
      {
        ...def,
        brand: this.configService.getInferred('cms.brand'),
        meta: this.configService.getInferred('cms.meta')[locale],
        locale,
      },
    );
  }
}
