import { Module } from '@nestjs/common';
import { AppConfigModule as GlitnirAppConfigModule } from '@forsetius/glitnir-config';
import { SecurityModule } from '@forsetius/glitnir-security';
import { ValidationModule } from '@forsetius/glitnir-validation';
import { AppController } from './AppController';
import { AppService } from './services/AppService';
import { TemplatingModule } from '@templating/TemplatingModule';
import { TechnobabbleModule } from '@domain/technobabble/TechnobabbleModule';
import { CmsModule } from '../base/cms/CmsModule';
import { MailModule } from '../io/mail';
import { appConfigBindings } from '@config/AppConfigBindings';

@Module({
  imports: [
    GlitnirAppConfigModule.forRoot(appConfigBindings),
    ValidationModule,
    SecurityModule,
    TemplatingModule,
    MailModule,
    CmsModule,
    TechnobabbleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
