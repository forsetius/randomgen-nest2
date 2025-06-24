import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Lang } from '@shared/types/Lang';
import { CmsService } from './services/CmsService';
import type { Response } from 'express';
import { SearchParamsDto, SearchQueryDto } from './dtos/SearchDto';
import { TagParamDto } from './dtos/TagParamDto';
import { LangQueryDto } from './dtos/LangQueryDto';
import { ContactDto } from './dtos/ContactDto';
import { MailService } from '../../io/mail';
import { AppConfigService } from '@config/AppConfigService';
import { AkismetInterceptor } from '../security/interceptors/AkismetInterceptor';

@Controller()
export class CmsController {
  private readonly logger = new Logger(CmsController.name);

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

  @Post('/contact')
  @UseInterceptors(AkismetInterceptor<ContactDto>)
  public async submitContactForm(@Body() dto: ContactDto) {
    this.logger.debug(
      `A message from: ${dto.name} <${dto.email}> titled: ${dto.title}\n${dto.content.slice(0, 79)}`,
    );

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
