import { Module } from '@nestjs/common';
import { AppConfigModule as GlitnirAppConfigModule } from '@forsetius/glitnir-config';
import { SecurityModule } from '@forsetius/glitnir-security';
import { ValidationModule } from '@forsetius/glitnir-validation';
import { AppController } from './AppController';
import { AppService } from './services/AppService';
import { TechnobabbleModule } from '@domain/technobabble/TechnobabbleModule';
import { CmsModule } from '../cms/CmsModule';
import { appConfigBindings } from '@config/AppConfigBindings';

@Module({
  imports: [
    GlitnirAppConfigModule.forRoot(appConfigBindings),
    ValidationModule,
    SecurityModule,
    CmsModule,
    TechnobabbleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
