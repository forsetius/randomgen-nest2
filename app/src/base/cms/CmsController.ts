import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { CmsService } from './services/CmsService';
import type { Response } from 'express';
import { SearchParamsDto, SearchQueryDto } from './dtos/SearchDto';

@Controller()
export class CmsController {
  public constructor(private contentService: CmsService) {}

  @Get('/')
  public index(
    @Query('lang') lang: Locale = Locale.PL,
    @Res() res: Response,
  ): void {
    res.redirect(302, `/pages/${lang}/index.html`);
  }

  @Get('/search/:count')
  public search(
    @Param() params: SearchParamsDto,
    @Query() query: SearchQueryDto,
  ) {
    const { count } = params;
    const { term, lang } = query;

    return this.contentService.search(term, lang, count);
  }

  @Get('/search')
  public searchAll(@Query() query: SearchQueryDto) {
    const { term, lang } = query;

    return this.contentService.search(
      term,
      lang,
      undefined,
      'fragment-img-card',
    );
  }
}
