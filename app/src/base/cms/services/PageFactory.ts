import type { MarkdownApi } from '@forsetius/glitnir-markdown';
import { Inject, Injectable } from '@nestjs/common';
import { TemplatingService } from '@templating/TemplatingService';
import { Page } from '../domain/Page';
import { PageDef, PageZodSchema } from '../types';
import { ZodError } from 'zod';
import { SourceFileValidationException } from '../exceptions/SourceFileValidationException';
import { BlockFactory } from './BlockFactory';
import { Locale } from '../domain/Locale';
import type { SitewideData } from '../types/CmsModuleOptions';
import { CmsModuleConfigContract } from '@config/AppConfigContracts';
import { CMS_MARKDOWN_API } from '../markdown/CmsMarkdownApiToken';

@Injectable()
export class PageFactory {
  private readonly metadata: SitewideData;

  public constructor(
    private readonly blockFactory: BlockFactory,
    @Inject(CMS_MARKDOWN_API)
    private readonly markdownApi: MarkdownApi,
    private readonly templatingService: TemplatingService,
    @Inject(CmsModuleConfigContract.token)
    config: SitewideData,
  ) {
    this.metadata = config;
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
      this.markdownApi,
      this.templatingService,
      this.metadata,
      filename,
      pageDef,
      locale,
    );
  }
}
