import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { CmsModuleConfigContract } from '../CmsModuleConfigContract';
import type {
  CmsLegacyRedirectOptions,
  CmsModuleOptions,
} from '../types/CmsModuleOptions';

const REDIRECTABLE_METHODS = new Set(['GET', 'HEAD']);

@Injectable()
export class LegacyCmsRedirectMiddleware implements NestMiddleware {
  constructor(
    @Inject(CmsModuleConfigContract.token)
    private readonly cmsConfig: Pick<CmsModuleOptions, 'legacyRedirects'>,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const legacyRedirect = this.resolveLegacyRedirect(request);

    if (!legacyRedirect) {
      next();
      return;
    }

    response.redirect(
      legacyRedirect.statusCode,
      this.buildTargetUrl(legacyRedirect, request.originalUrl),
    );
  }

  private resolveLegacyRedirect(
    request: Request,
  ): CmsLegacyRedirectOptions | undefined {
    if (!REDIRECTABLE_METHODS.has(request.method)) {
      return undefined;
    }

    return this.cmsConfig.legacyRedirects.find((legacyRedirect) =>
      request.path.startsWith(legacyRedirect.sourcePathPrefix),
    );
  }

  private buildTargetUrl(
    legacyRedirect: CmsLegacyRedirectOptions,
    originalUrl: string,
  ): string {
    return `${legacyRedirect.targetOrigin.replace(/\/+$/u, '')}${originalUrl}`;
  }
}
