import { Controller, Get, Query, Res } from '@nestjs/common';
import { Locale } from '@shared/types/Locale';
import { CmsService } from './services/CmsService';
import type { Response } from 'express';

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

  @Get('/search')
  public search(
    @Query('term') term: string,
    @Query('lang') lang: Locale = Locale.PL,
  ) {
    return this.contentService.search(term, lang);
  }
}
