import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Locale } from '@shared/types/Locale';
import { AppConfigService } from '@config/AppConfigService';

@Catch(
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  UnprocessableEntityException,
)
export class ClientExceptionFilter implements ExceptionFilter {
  constructor(private configService: AppConfigService) {}

  catch(_exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const lang =
      (ctx.getRequest<Request>().query['lang'] as Locale | undefined) ??
      Locale.PL;
    const title = lang === Locale.PL ? 'Zabronione' : 'Forbidden';

    response.status(HttpStatus.NOT_FOUND).render('error', {
      meta: this.configService.getInferred('cms.meta'),
      menus: this.configService.getInferred(`cms.menus.${lang}`),
      page: {
        title,
        headerImage: 'matrixtrio-head.jpg',
      },
    });
  }
}
