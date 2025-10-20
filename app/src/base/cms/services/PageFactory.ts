import { Injectable } from '@nestjs/common';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { TemplatingService } from '@templating/TemplatingService';
import { Page } from '../domain/Page';
import { PageDef, PageZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { BlockFactory } from './BlockFactory';
import { Locale } from '../domain/Locale';
import type { SitewideData } from '../types/CmsModuleOptions';
import { AppConfigService } from '@config/AppConfigService';

@Injectable()
export class PageFactory {
  private readonly metadata: SitewideData;

  public constructor(
    private readonly blockFactory: BlockFactory,
    private readonly markdownService: MarkdownService,
    private readonly templatingService: TemplatingService,
    configService: AppConfigService,
  ) {
    this.metadata = configService.get('cms');
  }

  /**
   * @throws {SourceFileValidationException}
   */
  public validate(filename: string, def: unknown): PageDef {
    try {
      return PageZodSchema.parse(def);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new SourceFileValidationException(filename, e);
      }

      throw e;
    }
  }

  public createAll(pageDefs: Map<string, unknown>, locale: Locale): Page[] {
    return Array.from(pageDefs).map(([source, def]) => {
      return this.create(source, def, locale);
    });
  }

  public create(filename: string, def: unknown, locale: Locale): Page {
    const pageDef: PageDef = this.validate(`${locale.lang}/${filename}`, def);

    return new Page(
      this.blockFactory,
      this.markdownService,
      this.templatingService,
      this.metadata,
      filename,
      pageDef,
      locale,
    );
  }
}
