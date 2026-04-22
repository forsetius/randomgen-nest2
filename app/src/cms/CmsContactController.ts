import {
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { MailService } from '@forsetius/glitnir-mail';
import { ParsedArgs, ZodSchema } from '@forsetius/glitnir-validation';
import { CmsModuleConfigContract } from '@config/AppConfigContracts';
import { ContactRequestSchema, type ContactDto } from './dtos/ContactDto';
import { ContactSpamCheckInterceptor } from './interceptors/ContactSpamCheckInterceptor';
import type { CmsModuleOptions } from './types/CmsModuleOptions';

@Controller()
export class CmsContactController {
  public constructor(
    @Inject(CmsModuleConfigContract.token)
    private readonly cmsConfig: CmsModuleOptions,
    private readonly mailService: MailService,
  ) {}

  @Post('/contact')
  @UseInterceptors(ContactSpamCheckInterceptor)
  @ZodSchema({ body: ContactRequestSchema })
  public async submitContactForm(@ParsedArgs() parsedDto: ContactDto) {
    try {
      await this.mailService.sendMail({
        to: [this.cmsConfig.contact.recipient],
        replyTo: [
          {
            address: parsedDto.email,
            name: parsedDto.name,
          },
        ],
        subject: parsedDto.title,
        text: `
From: ${parsedDto.name} <${parsedDto.email}>
Title: ${parsedDto.title}
---
${parsedDto.content}
        `,
      });

      return {};
    } catch (error) {
      const reason = error instanceof Error ? `: ${error.message}` : '.';

      throw new InternalServerErrorException(
        `Could not send an email${reason}`,
      );
    }
  }
}
