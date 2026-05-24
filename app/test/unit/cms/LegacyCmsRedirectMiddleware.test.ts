import type { NextFunction, Request, Response } from 'express';
import { LegacyCmsRedirectMiddleware } from '../../../src/cms/middleware/LegacyCmsRedirectMiddleware';
import type { CmsModuleOptions } from '../../../src/cms/types/CmsModuleOptions';

function createMiddleware(
  config: Pick<CmsModuleOptions, 'legacyRedirects'>,
): LegacyCmsRedirectMiddleware {
  return new LegacyCmsRedirectMiddleware(config);
}

function createRequest(
  path: string,
  originalUrl: string = path,
  method = 'GET',
): Request {
  return {
    method,
    path,
    originalUrl,
  } as Request;
}

interface ResponseDouble {
  readonly response: Response;
  readonly redirect: jest.Mock;
}

function createResponse(): ResponseDouble {
  const redirect = jest.fn();

  return {
    response: {
      redirect,
    } as unknown as Response,
    redirect,
  };
}

describe('LegacyCmsRedirectMiddleware', () => {
  test('redirects matching legacy CMS paths to a configured target origin', () => {
    const middleware = createMiddleware({
      legacyRedirects: [
        {
          sourcePathPrefix: '/pages/pl/eclipse-phase',
          targetOrigin: 'https://rpg.forseti.pl/',
          statusCode: 301,
        },
      ],
    });
    const { response, redirect } = createResponse();
    const next: NextFunction = jest.fn();

    middleware.use(
      createRequest(
        '/pages/pl/eclipse-phase.html',
        '/pages/pl/eclipse-phase.html?source=randomgen',
      ),
      response,
      next,
    );

    expect(redirect).toHaveBeenCalledWith(
      301,
      'https://rpg.forseti.pl/pages/pl/eclipse-phase.html?source=randomgen',
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('passes through unmatched or non-idempotent requests', () => {
    const middleware = createMiddleware({
      legacyRedirects: [
        {
          sourcePathPrefix: '/pages/pl/eclipse-phase',
          targetOrigin: 'https://rpg.forseti.pl',
          statusCode: 301,
        },
      ],
    });
    const { response, redirect } = createResponse();
    const next: NextFunction = jest.fn();

    middleware.use(createRequest('/pages/pl/index.html'), response, next);
    middleware.use(
      createRequest(
        '/pages/pl/eclipse-phase.html',
        '/pages/pl/eclipse-phase.html',
        'POST',
      ),
      response,
      next,
    );

    expect(redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(2);
  });
});
