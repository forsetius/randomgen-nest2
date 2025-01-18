import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { ContentService } from './services/ContentService';

@Controller()
export class CmsController {
  private contentService: Record<Locale, ContentService>;

  public constructor(
    @Inject('PlContentService') PlContentService: ContentService,
    @Inject('EnContentService') EnContentService: ContentService,
  ) {
    this.contentService = {
      [Locale.PL]: PlContentService,
      [Locale.EN]: EnContentService,
    };
  }

  @Get('/')
  public index(@Query('lang') lang: Locale = Locale.PL) {
    return this.contentService[lang].renderPage('_index');
  }

  @Get('/:slug')
  public getPage(
    @Param('slug') slug: string,
    @Query('lang') lang: Locale = Locale.PL,
  ) {
    return this.contentService[lang].renderPage(slug);
  }

  @Get('/search')
  public search(
    @Query('term') term: string,
    @Query('lang') lang: Locale = Locale.PL,
  ) {
    return this.contentService[lang].search(term);
  }
}
