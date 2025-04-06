import { Module } from '@nestjs/common';
import { AppConfigService } from '@config/AppConfigService';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';
import { CmsController } from './CmsController';
import { Page } from './domain';
import { ContentService } from './services/ContentService';
import { MarkdownService } from '../parser/services/MarkdownService';
import { PageDef, PageFactory } from './types';
import { ParserModule } from '../parser/ParserModule';
import { ParserService } from '../parser/services/ParserService';

@Module({
  controllers: [CmsController],
})
export class CmsModule {
  static forRoot() {
    return {
      module: CmsModule,
      imports: [ParserModule],
      providers: [
        MarkdownService,
        {
          provide: 'PageFactory',
          useFactory: (markdownService: MarkdownService) => {
            return (slug: string, def: PageDef, locale: Locale) =>
              new Page(markdownService, slug, def, locale);
          },
          inject: [MarkdownService],
        },
        {
          provide: 'PlContentService',
          useFactory: (
            parserService: ParserService,
            templatingService: TemplatingService,
            createPage: PageFactory,
            configService: AppConfigService,
          ) => {
            const metadata = {
              meta: configService.getInferred(`cms.meta.${Locale.PL}`),
              menus: configService.getInferred(`cms.menus.${Locale.PL}`),
            };

            return new ContentService(
              parserService,
              templatingService,
              createPage,
              Locale.PL,
              metadata,
            );
          },
          inject: [ParserService, TemplatingService, 'PageFactory', AppConfigService],
        },
        // {
        //   provide: 'EnContentService',
        //   useFactory: (
        //     parserService: ParserService,
        //     templatingService: TemplatingService,
        //     createPage: PageFactory,
        //     configService: AppConfigService,
        //   ) => {
        //     const metadata = {
        //       meta: configService.getInferred(`cms.meta.${Locale.EN}`),
        //       menus: configService.getInferred(`cms.menus.${Locale.EN}`),
        //     };
        //
        //     return new ContentService(
        //       parserService,
        //       templatingService,
        //       createPage,
        //       Locale.EN,
        //       metadata,
        //     );
        //   },
        //   inject: [ParserService, TemplatingService, 'PageFactory', AppConfigService],
        // },
      ],
    };
  }
}
