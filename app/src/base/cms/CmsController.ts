import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Lang } from '@shared/types/Lang';
import { CmsService } from './services';
import type { Response } from 'express';
import { MailService } from '../../io/mail';
import { AppConfigService } from '@config/AppConfigService';
import { AkismetInterceptor } from '../security/interceptors/AkismetInterceptor';
import * as Dto from './dtos';

@Controller()
export class CmsController {
  public constructor(
    private configService: AppConfigService,
    private contentService: CmsService,
    private mailService: MailService,
  ) {}

  @Get('/')
  public index(
    @Query('lang') lang: Lang = Lang.PL,
    @Res() res: Response,
  ): void {
    res.redirect(302, `/pages/${lang}/index.html`);
  }

  @Get('/search/:count')
  public search(
    @Param() params: Dto.SearchParamsDto,
    @Query() query: Dto.SearchQueryDto,
  ) {
    const { count } = params;
    const { term, lang } = query;

    return this.contentService.search(term, lang, 'fragment-list-item', count);
  }

  @Get('/search')
  public searchAll(@Query() query: Dto.SearchQueryDto) {
    const { term, lang } = query;

    return this.contentService.search(term, lang, 'fragment-img-card');
  }

  @Get('/tag/:tag')
  public getTag(
    @Param() params: Dto.TagParamDto,
    @Query() query: Dto.LangQueryDto,
  ) {
    return this.contentService.getTag(
      params.tag,
      query.lang,
      'fragment-img-card',
    );
  }

  @Get('/tag')
  public getTags(@Query() query: Dto.LangQueryDto) {
    return this.contentService.getTags(query.lang, 'fragment-list-item');
  }

  @Post('/contact')
  @UseInterceptors(AkismetInterceptor<Dto.ContactDto>)
  public async submitContactForm(@Body() dto: Dto.ContactDto) {
    const config = this.configService.getInferred('mail');
    try {
      await this.mailService.sendMail({
        from: config.sender,
        to: config.adminEmail,
        replyTo: dto.email,
        subject: dto.title,
        text: `
From: ${dto.name} <${dto.email}>
Title: ${dto.title}
---
${dto.content}
        `,
      });

      return {};
    } catch (e) {
      const reason = e instanceof Error ? `: ${e.message}` : '';
      throw new InternalServerErrorException(
        `Could not send an email${reason}`,
      );
    }
  }
}
