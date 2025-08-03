import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Request } from 'express';
import { AkismetService } from '../services/AkismetService';

interface ContactLike {
  name: string;
  email: string;
  content: string;
}

@Injectable()
export class AkismetInterceptor<TBody extends ContactLike>
  implements NestInterceptor
{
  constructor(private readonly akismetService: AkismetService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const body = request.body as TBody;

    return from(
      this.akismetService.isSpam(request, 'contact-form', {
        author: body.name,
        email: body.email,
        content: body.content,
      }),
    ).pipe(
      mergeMap((isSpam) => {
        if (isSpam) {
          throw new ForbiddenException('Spam detected by Akismet');
        }
        return next.handle();
      }),
    );
  }
}
