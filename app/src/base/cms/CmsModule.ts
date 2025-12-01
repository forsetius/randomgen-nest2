import * as express from 'express';
import { HttpModule } from '@nestjs/axios';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppConfigModule } from '@config/AppConfigModule';
import { MailModule } from '../../io/mail';
import { ParserModule } from '../parser/ParserModule';
import { SecurityModule } from '../security/SecurityModule';
import { TemplatingModule } from '@templating/TemplatingModule';
import { CmsController } from './CmsController';
import { BlockFactory, CmsService, MenuFactory, PageFactory } from './services';
import { ContentSecurityPolicyRegistry } from '../security/ContentSecurityPolicyRegistry';
import { LibraryFactory } from './services';
import { AppConfigService } from '@config/AppConfigService';

@Module({
  imports: [
    AppConfigModule,
    HttpModule,
    ParserModule,
    SecurityModule,
    TemplatingModule,
    MailModule,
  ],
  controllers: [CmsController],
  providers: [
    BlockFactory,
    MenuFactory,
    PageFactory,
    LibraryFactory,
    CmsService,
  ],
})
export class CmsModule implements OnModuleInit {
  private readonly logger = new Logger(CmsModule.name);

  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private readonly configService: AppConfigService,
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

    useStatic('ui', this.configService.get('cms.paths.uiDir'));
    useStatic('media', this.configService.get('cms.paths.mediaDir'));
    useStatic('pages', this.configService.get('cms.paths.outputDir'));
  }
}
