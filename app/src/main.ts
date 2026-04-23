import { Settings as LuxonSettings } from 'luxon';
import { SHARED_CONFIG_TOKEN } from '@forsetius/glitnir-config';
import { stringifyError } from '@forsetius/glitnir-shared';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@app/AppModule';
import { NotFoundFilter } from '@shared/filters/NotFoundFilter';
import stopwatch from '@shared/util/stopwatch';
import type { AppModuleOptions } from '@app/types/AppModuleOptions';

stopwatch.record('after imports');

async function bootstrap(): Promise<void> {
  LuxonSettings.throwOnInvalid = true;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  stopwatch.record('app created');

  app.enableVersioning({ type: VersioningType.URI, prefix: false });
  app.enableShutdownHooks();
  app.useGlobalFilters(new NotFoundFilter());

  try {
    await app.init();
    stopwatch.record('app initialized');
    const port = app.get<AppModuleOptions>(SHARED_CONFIG_TOKEN).port;

    await app.listen(port);
  } catch (error) {
    console.error(
      'Error while starting the application:',
      stringifyError(error),
    );
    stopwatch.record('Exiting with error');

    process.exit(1);
  } finally {
    stopwatch.list();
  }
}

void bootstrap();
