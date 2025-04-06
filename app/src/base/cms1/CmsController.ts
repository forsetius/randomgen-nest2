import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { CmsService } from './CmsService';

@Controller()
export class CmsController {
  private contentService: Record<Locale, CmsService>;

  public constructor(
    @Inject('PlCmsService') PlContentService: CmsService,
    // @Inject('EnCmsService') EnContentService: ContentService,
  ) {
    this.contentService = {
      [Locale.PL]: PlContentService,
      [Locale.EN]: PlContentService,
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
