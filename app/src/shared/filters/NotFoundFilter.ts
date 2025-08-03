import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Lang } from '@shared/types/Lang';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(_exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const lang = ctx
      .getRequest<Request>()
      .acceptsLanguages()
      .some((language) => language.toLowerCase().startsWith(Lang.PL))
      ? Lang.PL
      : Lang.EN;
    const res = ctx.getResponse<Response>();

    res.status(HttpStatus.NOT_FOUND).redirect(`/pages/${lang}/error-404.html`);
  }
}
