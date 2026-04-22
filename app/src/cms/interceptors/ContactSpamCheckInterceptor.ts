import {
  type CallHandler,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import {
  AkismetInterceptor,
  type AkismetSpamCheckInput,
} from '@forsetius/glitnir-spamcheck';
import {
  CmsMdConfigContract,
  type CmsMdConfig,
} from '@forsetius/glitnir-cms-md';
import { finalize, type Observable } from 'rxjs';
import type { ContactDto } from '../dtos/ContactDto';

interface ContactSpamCheckRequest {
  body: ContactDto | AkismetSpamCheckInput | undefined;
  originalUrl?: string;
  url: string;
}

@Injectable()
export class ContactSpamCheckInterceptor implements NestInterceptor {
  public constructor(
    private readonly akismetInterceptor: AkismetInterceptor,
    @Inject(CmsMdConfigContract.token)
    private readonly cmsMdConfig: Pick<CmsMdConfig, 'appOrigin'>,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<ContactSpamCheckRequest>();
    const originalBody = request.body;

    request.body = this.mapContactRequestBody(
      originalBody,
      request.originalUrl ?? request.url,
    );

    const restoringNext: CallHandler = {
      handle: () => {
        request.body = originalBody;
        return next.handle();
      },
    };

    return this.akismetInterceptor.intercept(context, restoringNext).pipe(
      finalize(() => {
        request.body = originalBody;
      }),
    );
  }

  private mapContactRequestBody(
    body: ContactSpamCheckRequest['body'],
    requestPath: string,
  ): AkismetSpamCheckInput {
    const contactBody = body as Partial<ContactDto> | undefined;
    const content = [contactBody?.title, contactBody?.content]
      .filter((value): value is string => {
        return typeof value === 'string' && value.trim().length > 0;
      })
      .join('\n\n');

    return {
      permalink: this.resolvePermalink(requestPath),
      ...(contactBody?.name ? { authorName: contactBody.name } : {}),
      ...(contactBody?.email ? { authorEmail: contactBody.email } : {}),
      ...(content ? { content } : {}),
      type: 'contact-form',
    };
  }

  private resolvePermalink(requestPath: string): string {
    return new URL(requestPath, this.cmsMdConfig.appOrigin).toString();
  }
}
