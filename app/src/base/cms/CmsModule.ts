import { join } from 'node:path';
import { HttpModule } from '@nestjs/axios';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Locale } from '@shared/types/Locale';
import { ParserModule } from '../parser/ParserModule';
import { ParserService } from '../parser/services/ParserService';
import { TemplatingModule } from '@templating/TemplatingModule';
import { CmsController } from './CmsController';
import { BlockFactory } from './services/BlockFactory';
import { MenuFactory } from './services/MenuFactory';
import { PageFactory } from './services/PageFactory';
import { CmsService } from './services/CmsService';
import { ContentSecurityPolicyRegistry } from '../security/ContentSecurityPolicyRegistry';
import { SecurityModule } from '../security/SecurityModule';
import * as express from 'express';

@Module({
  controllers: [CmsController],
})
export class CmsModule implements OnModuleInit {
  private readonly logger = new Logger(CmsModule.name);

  constructor(private readonly adapterHost: HttpAdapterHost) {}

  onModuleInit() {
    const expressApp: express.Express =
      this.adapterHost.httpAdapter.getInstance();

    const staticPath = join(process.cwd(), 'content/cms/static');
    this.logger.log(`Serving static from: ${staticPath}`);

    expressApp.use('/static', express.static(staticPath));
  }

  static forRoot() {
    return {
      module: CmsModule,
      imports: [HttpModule, ParserModule, SecurityModule, TemplatingModule],
      providers: [
        BlockFactory,
        MenuFactory,
        PageFactory,
        createCmsService('PlCmsService', Locale.PL),
        // createCmsService('EnCmsService', Locale.EN),
      ],
    };
  }
}

function createCmsService(name: string, locale: Locale) {
  return {
    provide: name,
    useFactory: (
      blockFactory: BlockFactory,
      menuFactory: MenuFactory,
      pageFactory: PageFactory,
      parserService: ParserService,
      cspRegistry: ContentSecurityPolicyRegistry,
    ) => {
      cspRegistry.registerScriptSrc('https://use.fontawesome.com');
      cspRegistry.registerStyleSrc('https://use.fontawesome.com');
      cspRegistry.registerFontSrc('https://use.fontawesome.com');

      return new CmsService(
        blockFactory,
        menuFactory,
        pageFactory,
        parserService,
        locale,
      );
    },
    inject: [
      BlockFactory,
      MenuFactory,
      PageFactory,
      ParserService,
      ContentSecurityPolicyRegistry,
    ],
  };
}
