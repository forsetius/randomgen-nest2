import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Locale } from '@shared/types/Locale';
import { AppConfigService } from '@config/AppConfigService';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private configService: AppConfigService) {}

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const lang =
      (ctx.getRequest<Request>().query['lang'] as Locale | undefined) ??
      Locale.PL;
    const title =
      lang === Locale.PL ? 'Nie znaleziono strony' : 'Page not found';

    response.status(HttpStatus.NOT_FOUND).render('error', {
      meta: this.configService.getInferred('cms.meta'),
      menus: this.configService.getInferred(`cms.menus.${lang}`),
      page: {
        title,
        content: exception.message,
        headerImage: 'neo-head.jpg',
      },
    });
  }
}
