import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './services/AppService';
import { AppConfigModule } from '@config/AppConfigModule';
import { SecurityModule } from '../base/security/SecurityModule';
import { TemplatingModule } from '@templating/TemplatingModule';
import { TechnobabbleModule } from '@domain/technobabble/TechnobabbleModule';
import { CmsModule } from '../base/cms/CmsModule';
import { ParserModule } from '../base/parser/ParserModule';
import { MailModule } from '../io/mail';
import { ScenGenModule } from '@domain/scengen/ScenGenModule';

@Module({
  imports: [
    AppConfigModule,
    SecurityModule,
    TemplatingModule,
    MailModule,
    CmsModule,
    ParserModule,
    ScenGenModule,
    TechnobabbleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
