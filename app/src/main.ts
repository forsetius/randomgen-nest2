import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ApiDocService } from './base/apidoc/ApiDocService';
import { AppConfigService } from '@config/AppConfigService';
import { AppModule } from './app/AppModule';
import { SecurityService } from './base/security/SecurityService';
import { Env } from '@shared/types/Env';
import { Settings as LuxonSettings } from 'luxon';

async function bootstrap(): Promise<void> {
  LuxonSettings.throwOnInvalid = true;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(AppConfigService);

  app.enableVersioning({ type: VersioningType.URI, prefix: false });
  app.enableShutdownHooks();
  app.get(SecurityService).setup(app);
  app.get(ApiDocService).setup(app);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: configService.getInferred('app.env') === Env.PROD,
      transform: true,
      whitelist: true,
    }),
  );

  try {
    await app.init();
    await app.listen(configService.getInferred('app.port'));

    console.log(
      `Application started on port ${configService.getInferred('app.port')}`,
    );
  } catch (error) {
    console.error('Error while starting the application:', error);
    process.exit(1);
  }
}

void bootstrap();
