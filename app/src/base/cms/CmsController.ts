import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import type { Lang } from '@shared/types/Lang';
import { CmsService } from './services';
import type { Response } from 'express';
import { MailService } from '../../io/mail';
import { ParsedArgs, ZodSchema } from '@forsetius/glitnir-validation';
import { MailModuleConfigContract } from '@config/AppConfigContracts';
import * as Dto from './dtos';
import { ContactSpamCheckInterceptor } from './interceptors/ContactSpamCheckInterceptor';
import type { MailModuleOptions } from '../../io/mail/types/MailModuleOptions';

@Controller()
export class CmsController {
  public constructor(
    @Inject(MailModuleConfigContract.token)
    private readonly mailConfig: MailModuleOptions,
    private contentService: CmsService,
    private mailService: MailService,
  ) {}

  @Get()
  @ZodSchema((configService) => ({
    query: Dto.LangSchema(configService),
  }))
  public index(@ParsedArgs('lang') lang: Lang, @Res() res: Response): void {
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
    query: Dto.LangSchema(configService),
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
    query: Dto.LangSchema(configService),
  }))
  public getTags(@ParsedArgs('lang') lang: Lang) {
    return this.contentService.getTags(lang, 'fragment-list-item');
  }

  @Post('/contact')
  @UseInterceptors(ContactSpamCheckInterceptor)
  @ZodSchema({ body: Dto.ContactRequestSchema })
  public async submitContactForm(@ParsedArgs() parsedDto: Dto.ContactDto) {
    try {
      await this.mailService.sendMail({
        from: this.mailConfig.sender,
        to: this.mailConfig.adminEmail,
        replyTo: parsedDto.email,
        subject: parsedDto.title,
        text: `
From: ${parsedDto.name} <${parsedDto.email}>
Title: ${parsedDto.title}
---
${parsedDto.content}
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

  /* Has to be last so that it won't catch `/tag/:tag`, `/tag`, `/search` and `/contact` */
  @Get('/:lang')
  @ZodSchema((configService) => ({
    params: Dto.LangSchema(configService),
  }))
  public indexLang(@ParsedArgs('lang') lang: Lang, @Res() res: Response): void {
    res.redirect(302, `/pages/${lang}/index.html`);
  }
}
