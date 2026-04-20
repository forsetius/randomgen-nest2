import * as express from 'express';
import { HttpModule } from '@nestjs/axios';
import {
  MarkdownFactory,
  MarkdownModule,
  type MarkdownApi,
} from '@forsetius/glitnir-markdown';
import {
  AkismetInterceptor,
  SpamCheckModule,
} from '@forsetius/glitnir-spamcheck';
import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import {
  ContentSecurityPolicyRegistry,
  SecurityModule,
} from '@forsetius/glitnir-security';
import { HttpAdapterHost } from '@nestjs/core';
import { MailModule } from '../../io/mail';
import { TemplatingModule } from '@templating/TemplatingModule';
import { CmsController } from './CmsController';
import { ContactSpamCheckInterceptor } from './interceptors/ContactSpamCheckInterceptor';
import { CMS_MARKDOWN_API } from './markdown/CmsMarkdownApiToken';
import { createCmsMarkdownRenderingProfile } from './markdown/createCmsMarkdownRenderingProfile';
import { BlockFactory, CmsService, MenuFactory, PageFactory } from './services';
import { CmsSourceParserService } from './services/CmsSourceParserService';
import { LibraryFactory } from './services';
import { CmsModuleConfigContract } from '@config/AppConfigContracts';
import type { CmsModuleOptions } from './types/CmsModuleOptions';

@Module({
  imports: [
    HttpModule,
    MarkdownModule,
    SecurityModule,
    SpamCheckModule,
    TemplatingModule,
    MailModule,
  ],
  controllers: [CmsController],
  providers: [
    {
      provide: CMS_MARKDOWN_API,
      inject: [MarkdownFactory, CmsModuleConfigContract.token],
      useFactory: (
        markdownFactory: MarkdownFactory,
        cmsConfig: CmsModuleOptions,
      ): MarkdownApi => {
        return markdownFactory.create(
          createCmsMarkdownRenderingProfile(cmsConfig.appOrigin),
        );
      },
    },
    BlockFactory,
    MenuFactory,
    PageFactory,
    LibraryFactory,
    AkismetInterceptor,
    CmsService,
    CmsSourceParserService,
    ContactSpamCheckInterceptor,
  ],
})
export class CmsModule implements OnModuleInit {
  private readonly logger = new Logger(CmsModule.name);

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    @Inject(CmsModuleConfigContract.token)
    private readonly cmsConfig: CmsModuleOptions,
    cspRegistry: ContentSecurityPolicyRegistry,
  ) {
    // FIXME: czy potrzebne?
    cspRegistry.registerScriptSrc('https://use.fontawesome.com');
    cspRegistry.registerStyleSrc('https://use.fontawesome.com');
    cspRegistry.registerFontSrc('https://use.fontawesome.com');
  }

  onModuleInit() {
    const expressApp: express.Express =
      this.adapterHost.httpAdapter.getInstance();

    const useStatic = (dir: string, path: string) => {
      expressApp.use(`/${dir}`, express.static(path));
      this.logger.log(`Serving ${dir} from: ${path}`);
    };

    useStatic('ui', this.cmsConfig.paths.uiDir);
    useStatic('media', this.cmsConfig.paths.mediaDir);
    useStatic('pages', this.cmsConfig.paths.outputDir);
  }
}
