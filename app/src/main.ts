import stopwatch from '@shared/util/stopwatch';
import { Settings as LuxonSettings } from 'luxon';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from '@config/AppConfigService';
import { AppModule } from './app/AppModule';
import { SecurityService } from './base/security/SecurityService';
import { Env } from '@shared/types/Env';

stopwatch.record('after imports');

async function bootstrap(): Promise<void> {
  LuxonSettings.throwOnInvalid = true;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  stopwatch.record('app created');

  const configService = app.get(AppConfigService);
  app.enableVersioning({ type: VersioningType.URI, prefix: false });
  app.enableShutdownHooks();
  app.get(SecurityService).setup(app);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: configService.getInferred('app.env') === Env.PROD,
      transform: true,
      whitelist: true,
    }),
  );

  try {
    await app.init();
    stopwatch.record('app initialized');

    await app.listen(configService.getInferred('app.port'));
  } catch (error) {
    console.error('Error while starting the application:', error);
    stopwatch.record('Exiting with error');

    process.exit(1);
  } finally {
    stopwatch.list();
  }
}

void bootstrap();
