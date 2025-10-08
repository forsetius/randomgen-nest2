import stopwatch from '@shared/util/stopwatch';
import { Settings as LuxonSettings } from 'luxon';
import { VersioningType } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from '@config/AppConfigService';
import { AppModule } from './app/AppModule';
import { SecurityService } from './base/security/services/SecurityService';
import { NotFoundFilter } from '@shared/filters/NotFoundFilter';
import { ZodRequestInterceptor } from '@shared/validation/ZodRequestInterceptor';

stopwatch.record('after imports');

async function bootstrap(): Promise<void> {
  LuxonSettings.throwOnInvalid = true;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  stopwatch.record('app created');

  const configService = app.get(AppConfigService);
  app.enableVersioning({ type: VersioningType.URI, prefix: false });
  app.enableShutdownHooks();
  app.get(SecurityService).setup(app);

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ZodRequestInterceptor(configService, reflector),
  );
  app.useGlobalFilters(new NotFoundFilter());

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
