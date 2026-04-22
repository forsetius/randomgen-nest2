import { Settings as LuxonSettings } from 'luxon';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@app/AppModule';
import { resolveAppConfigRegistry } from '@config/AppConfigContracts';
import { NotFoundFilter } from '@shared/filters/NotFoundFilter';
import stopwatch from '@shared/util/stopwatch';

stopwatch.record('after imports');

async function bootstrap(): Promise<void> {
  LuxonSettings.throwOnInvalid = true;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  stopwatch.record('app created');

  const config = resolveAppConfigRegistry((token) => app.get(token));
  app.enableVersioning({ type: VersioningType.URI, prefix: false });
  app.enableShutdownHooks();
  app.useGlobalFilters(new NotFoundFilter());

  try {
    await app.init();
    stopwatch.record('app initialized');

    await app.listen(config.app.port);
  } catch (error) {
    console.error('Error while starting the application:', error);
    stopwatch.record('Exiting with error');

    process.exit(1);
  } finally {
    stopwatch.list();
  }
}

void bootstrap();
