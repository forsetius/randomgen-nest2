import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, throwError, firstValueFrom, type Observable } from 'rxjs';
import type { CmsMdConfig } from '@forsetius/glitnir-cms-md';
import type { AkismetInterceptor } from '@forsetius/glitnir-spamcheck';
import { ContactSpamCheckInterceptor } from '../../../../../src/cms/interceptors/ContactSpamCheckInterceptor';
import type { ContactDto } from '../../../../../src/cms/dtos/ContactDto';

describe('ContactSpamCheckInterceptor', () => {
  const cmsMdConfig: Pick<CmsMdConfig, 'appOrigin'> = {
    appOrigin: 'https://example.test/',
  };

  function createExecutionContext(request: {
    body: ContactDto;
    originalUrl: string;
  }): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  }

  it('maps contact form payload to Akismet input and restores the original body before the handler runs', async () => {
    const originalBody: ContactDto = {
      catcher: '',
      name: 'Anna',
      email: 'anna@example.test',
      title: 'Greetings',
      content: 'Hello world',
    };
    const request = {
      body: originalBody,
      originalUrl: '/contact',
    };
    const context = createExecutionContext(request);
    const nextHandle = jest.fn(() => {
      expect(request.body).toBe(originalBody);
      return of('accepted');
    });
    const next: CallHandler = {
      handle: nextHandle,
    };
    const akismetIntercept = jest.fn(
      (
        receivedContext: ExecutionContext,
        receivedNext: CallHandler,
      ): Observable<unknown> => {
        expect(receivedContext).toBe(context);
        expect(request.body).toEqual({
          permalink: 'https://example.test/contact',
          authorName: 'Anna',
          authorEmail: 'anna@example.test',
          content: 'Greetings\n\nHello world',
          type: 'contact-form',
        });

        return receivedNext.handle();
      },
    );
    const akismetInterceptor = {
      intercept: akismetIntercept,
    } as unknown as AkismetInterceptor;
    const interceptor = new ContactSpamCheckInterceptor(
      akismetInterceptor,
      cmsMdConfig,
    );

    await expect(
      firstValueFrom(interceptor.intercept(context, next)),
    ).resolves.toBe('accepted');

    expect(nextHandle).toHaveBeenCalledTimes(1);
    expect(request.body).toBe(originalBody);
  });

  it('restores the original body when spamcheck rejects the request', async () => {
    const originalBody: ContactDto = {
      catcher: '',
      name: 'Anna',
      email: 'anna@example.test',
      title: 'Greetings',
      content: 'Hello world',
    };
    const request = {
      body: originalBody,
      originalUrl: '/contact',
    };
    const context = createExecutionContext(request);
    const nextHandle = jest.fn(() => of('accepted'));
    const next: CallHandler = {
      handle: nextHandle,
    };
    const akismetIntercept = jest.fn((): Observable<unknown> => {
      return throwError(() => new Error('spam verdict'));
    });
    const akismetInterceptor = {
      intercept: akismetIntercept,
    } as unknown as AkismetInterceptor;
    const interceptor = new ContactSpamCheckInterceptor(
      akismetInterceptor,
      cmsMdConfig,
    );

    await expect(
      firstValueFrom(interceptor.intercept(context, next)),
    ).rejects.toThrow('spam verdict');

    expect(nextHandle).not.toHaveBeenCalled();
    expect(request.body).toBe(originalBody);
  });
});
