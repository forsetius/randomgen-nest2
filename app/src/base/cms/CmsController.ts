import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Lang } from '@shared/types/Lang';
import { CmsService } from './services/CmsService';
import type { Response } from 'express';
import { SearchParamsDto, SearchQueryDto } from './dtos/SearchDto';
import { TagParamDto } from './dtos/TagParamDto';
import { LangQueryDto } from './dtos/LangQueryDto';

@Controller()
export class CmsController {
  public constructor(private contentService: CmsService) {}

  @Get('/')
  public index(
    @Query('lang') lang: Lang = Lang.PL,
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

    return this.contentService.search(term, lang, 'fragment-list-item', count);
  }

  @Get('/search')
  public searchAll(@Query() query: SearchQueryDto) {
    const { term, lang } = query;

    return this.contentService.search(term, lang, 'fragment-img-card');
  }

  @Get('/tag/:tag')
  public getTag(@Param() params: TagParamDto, @Query() query: LangQueryDto) {
    return this.contentService.getTag(
      params.tag,
      query.lang,
      'fragment-img-card',
    );
  }

  @Get('/tag')
  public getTags(@Query() query: LangQueryDto) {
    return this.contentService.getTags(query.lang, 'fragment-list-item');
  }
}
