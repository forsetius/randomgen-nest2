import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfigService } from '@config/AppConfigService';
import { NotFoundFilter } from '@shared/filters/NotFoundFilter';
import { ZodRequestInterceptor } from '@shared/validation/ZodRequestInterceptor';
import { AppModule } from '../../src/app/AppModule';
import { SecurityService } from '../../src/base/security/services/SecurityService';

export const setupApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();
  const configService = app.get(AppConfigService);
  const reflector = app.get(Reflector);
  app.get(SecurityService).setup(app);

  app.useGlobalInterceptors(
    new ZodRequestInterceptor(configService, reflector),
  );
  app.useGlobalFilters(new NotFoundFilter());

  await app.init();

  return app;
};
