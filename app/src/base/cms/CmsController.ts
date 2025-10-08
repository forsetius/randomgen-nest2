import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
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
import { ZodSchema } from '@shared/validation/ZodSchemaDecorator';
import { LangSchema } from '@shared/validation/LangDto';
import { ParsedArgs } from '@shared/validation/ParsedArgsDecorator';

@Controller()
export class CmsController {
  public constructor(
    private configService: AppConfigService,
    private contentService: CmsService,
    private mailService: MailService,
  ) {}

  @Get('/')
  public index(
    @ParsedArgs('lang') lang: Lang = Lang.PL,
    @Res() res: Response,
  ): void {
    res.redirect(302, `/pages/${lang}/index.html`);
  }

  @Get('/search')
  @ZodSchema((configService) => ({
    query: Dto.SearchQuerySchema(configService),
  }))
  public search(@ParsedArgs() params: Dto.SearchDto) {
    const { term, count, lang, brief } = params;
    const template = brief ? 'fragment-list-item' : 'fragment-img-card';

    return this.contentService.search(term, lang, template, count);
  }

  @Get('/tag/:tag')
  @ZodSchema((configService) => ({
    params: Dto.TagParamSchema,
    query: LangSchema(configService),
  }))
  public getTag(@ParsedArgs() params: Dto.TagDto) {
    return this.contentService.getTag(
      params.tag,
      params.lang,
      'fragment-img-card',
    );
  }

  @Get('/tag')
  @ZodSchema((configService) => ({
    query: LangSchema(configService),
  }))
  public getTags(@ParsedArgs('lang') lang: Lang) {
    return this.contentService.getTags(lang, 'fragment-list-item');
  }

  @Post('/contact')
  @UseInterceptors(AkismetInterceptor<Dto.ContactDto>)
  @ZodSchema({ body: Dto.ContactRequestSchema })
  public async submitContactForm(@ParsedArgs() dto: Dto.ContactDto) {
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
      const reason = e instanceof Error ? `: ${e.message}` : '.';
      throw new InternalServerErrorException(
        `Could not send an email${reason}`,
      );
    }
  }
}
