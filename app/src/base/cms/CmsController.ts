import { Controller, Get, Inject, Query, Render } from '@nestjs/common';
import { AppConfigService } from '@config/AppConfigService';
import { Language } from '@shared/types/Language';
import { ContentService } from './ContentService';

@Controller()
export class CmsController {
  private contentService: { pl: ContentService; en: ContentService };

  public constructor(
    private configService: AppConfigService,
    @Inject('PlContentService') PlContentService: ContentService,
    @Inject('EnContentService') EnContentService: ContentService,
  ) {
    this.contentService = {
      pl: PlContentService,
      en: EnContentService,
    };
  }

  @Get('/')
  @Render('index')
  public index(@Query('lang') lang: Language = Language.PL) {
    const page = this.contentService[lang].getPage('_index');

    return this.makeResponse(lang, { page });
  }

  private makeResponse(lang: Language, content: Record<string, object>) {
    return {
      meta: this.configService.getInferred('app.meta'),
      menus: this.configService.getInferred(`app.menus.${lang}`),
      ...content,
    };
  }
}
