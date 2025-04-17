import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './services/AppService';
import { AppConfigModule } from '@config/AppConfigModule';
import { SecurityModule } from '../base/security/SecurityModule';
import { TemplatingModule } from '@templating/TemplatingModule';
import { ApiDocModule } from '../base/apidoc/ApiDocModule';
import { TechnobabbleModule } from '@domain/technobabble/TechnobabbleModule';
import { CmsModule } from '../base/cms/CmsModule';
import { ParserModule } from '../base/parser/ParserModule';

const contentDir = path.join(__dirname, '..', '..', 'content', 'cms');

@Module({
  imports: [
    AppConfigModule,
    ApiDocModule,
    SecurityModule,
    TemplatingModule.forRoot({
      paths: contentDir,
      options: {
        autoescape: true,
        throwOnUndefined: true,
      },
    }),
    CmsModule.forRoot(),
    TechnobabbleModule,
    ParserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
