import { Module } from '@nestjs/common';
import { AppConfigService } from '@config/AppConfigService';
import { Locale } from '@shared/types/Locale';
import { TemplatingService } from '@templating/TemplatingService';
import { CmsController } from './CmsController';
import { Page } from './domain';
import { ContentService } from './services/ContentService';
import { MarkdownService } from './services/MarkdownService';
import { PageDef, PageFactory } from './types';

@Module({
  controllers: [CmsController],
})
export class CmsModule {
  static forRoot() {
    return {
      module: CmsModule,
      providers: [
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
            templatingService: TemplatingService,
            createPage: PageFactory,
            configService: AppConfigService,
          ) => {
            const metadata = {
              meta: configService.getInferred(`cms.meta.${Locale.PL}`),
              menus: configService.getInferred(`cms.menus.${Locale.PL}`),
            };

            return new ContentService(
              templatingService,
              createPage,
              Locale.PL,
              metadata,
            );
          },
          inject: [TemplatingService, 'PageFactory', AppConfigService],
        },
        {
          provide: 'EnContentService',
          useFactory: (
            templatingService: TemplatingService,
            createPage: PageFactory,
            configService: AppConfigService,
          ) => {
            const metadata = {
              meta: configService.getInferred(`cms.meta.${Locale.EN}`),
              menus: configService.getInferred(`cms.menus.${Locale.EN}`),
            };

            return new ContentService(
              templatingService,
              createPage,
              Locale.EN,
              metadata,
            );
          },
          inject: [TemplatingService, 'ContentFactory', AppConfigService],
        },
      ],
    };
  }
}
