import { Module } from '@nestjs/common';
import { ParserModule } from '../parser/ParserModule';
import { CmsController } from './CmsController';
import { Locale } from '@shared/types/Locale';
import { TemplatingModule } from '@templating/TemplatingModule';
import { BlockFactory } from './services/BlockFactory';
import { MenuFactory } from './services/MenuFactory';
import { PageFactory } from './services/PageFactory';
import { CmsService } from './services/CmsService';
// import { AppConfigService } from '@config/AppConfigService';
import { ParserService } from '../parser/services/ParserService';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CmsController],
})
export class CmsModule {
  static forRoot() {
    return {
      module: CmsModule,
      imports: [HttpModule, ParserModule, TemplatingModule],
      providers: [
        BlockFactory,
        MenuFactory,
        PageFactory,
        {
          provide: 'PlCmsService',
          useFactory: (
            // configService: AppConfigService,
            blockFactory: BlockFactory,
            menuFactory: MenuFactory,
            pageFactory: PageFactory,
            parserService: ParserService,
          ) => {
            // const metadata = configService.getInferred(`cms.meta.${Locale.PL}`);

            return new CmsService(
              blockFactory,
              menuFactory,
              pageFactory,
              parserService,
              Locale.PL,
            );
          },
          inject: [BlockFactory, MenuFactory, PageFactory, ParserService],
        },
      ],
    };
  }
}
