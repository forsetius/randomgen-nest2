import { Injectable } from '@nestjs/common';
import { MarkdownService } from '../../parser/services/MarkdownService';
import { TemplatingService } from '@templating/TemplatingService';
import { Page } from '../domain/Page';
import { BlockType, PageDef, PageZodSchema } from '../types';
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

  public createAll(
    pageDefs: Map<string, unknown>,
    lang: Locale,
  ): Map<string, Page> {
    return new Map(
      Array.from(pageDefs).map(([source, def]) => {
        const pageDef: PageDef = this.validate(source, def);

        return [source, this.create(source, pageDef, lang)];
      }),
    );
  }

  public create(filename: string, def: PageDef, lang: Locale): Page {
    return new Page(
      this.blockFactory,
      this.markdownService,
      this.templatingService,
      filename,
      def,
      lang,
    );
  }

  public createTagPage(
    tag: string,
    pages: Page[],
    tagPageDef: PageDef,
    lang: Locale,
  ): Page {
    return this.create(
      `tag-${tag}`,
      {
        ...tagPageDef,
        title: `${tagPageDef.title}: ${tag}`,
        blocks: {
          pages: {
            type: BlockType.PAGE_SET,
            template: 'fragment-img-overlay-card',
            items: pages.map((page) => page.slug),
          },
        },
      },
      lang,
    );
  }
}
