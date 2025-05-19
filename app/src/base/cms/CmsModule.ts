import { join } from 'node:path';
import { HttpModule } from '@nestjs/axios';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ParserModule } from '../parser/ParserModule';
import { TemplatingModule } from '@templating/TemplatingModule';
import { CmsController } from './CmsController';
import { BlockFactory } from './services/BlockFactory';
import { MenuFactory } from './services/MenuFactory';
import { PageFactory } from './services/PageFactory';
import { CmsService } from './services/CmsService';
import { ContentSecurityPolicyRegistry } from '../security/ContentSecurityPolicyRegistry';
import { SecurityModule } from '../security/SecurityModule';
import * as express from 'express';
import { CmsModuleOptions } from './types/CmsModuleOptions';
import { CMS_OPTIONS } from './CmsConstants';

@Module({
  controllers: [CmsController],
})
export class CmsModule implements OnModuleInit {
  private readonly logger = new Logger(CmsModule.name);

  constructor(
    private readonly adapterHost: HttpAdapterHost,
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

    const useStatic = (dir: string) => {
      const path = join(process.cwd(), `content/cms/static/${dir}`);
      expressApp.use(`/${dir}`, express.static(path));
      this.logger.log(`Serving ${dir} from: ${path}`);
    };

    useStatic('ui');
    useStatic('media');
    useStatic('pages');
  }

  static forRoot(options: CmsModuleOptions) {
    return {
      module: CmsModule,
      imports: [HttpModule, ParserModule, SecurityModule, TemplatingModule],
      providers: [
        BlockFactory,
        MenuFactory,
        PageFactory,
        CmsService,
        {
          provide: CMS_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
