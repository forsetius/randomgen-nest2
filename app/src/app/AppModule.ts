import * as path from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './services/AppService';
import { AppConfigModule } from '@config/AppConfigModule';
import { SecurityModule } from '../base/security/SecurityModule';
import { TemplatingModule } from '@templating/TemplatingModule';
import { ApiDocModule } from '../base/apidoc/ApiDocModule';
import { TechnobabbleModule } from '@domain/technobabble/TechnobabbleModule';

@Module({
  imports: [
    AppConfigModule,
    ApiDocModule,
    SecurityModule,
    TemplatingModule.forRoot({
      paths: [path.join(__dirname, '../../templates')],
      options: {
        autoescape: true,
      },
    }),
    TechnobabbleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
