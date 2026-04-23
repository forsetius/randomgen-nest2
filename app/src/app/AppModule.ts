import { Module } from '@nestjs/common';
import { AppConfigModule } from '@forsetius/glitnir-config';
import { SecurityModule } from '@forsetius/glitnir-security';
import { ValidationModule } from '@forsetius/glitnir-validation';
import { AppController } from './AppController';
import { AppService } from './services/AppService';
import { TechnobabbleModule } from '@domain/technobabble/TechnobabbleModule';
import { CmsModule } from '../cms/CmsModule';
import { configBindings } from '@app/ConfigBindings';

@Module({
  imports: [
    AppConfigModule.forRoot(configBindings),
    ValidationModule,
    SecurityModule,
    CmsModule,
    TechnobabbleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
