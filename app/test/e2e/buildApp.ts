import path from 'node:path';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@app/AppModule';
import { AppConfigService } from '@config/AppConfigService';
import { NotFoundFilter } from '@shared/filters/NotFoundFilter';
import { ZodRequestInterceptor } from '@shared/validation/ZodRequestInterceptor';
import { SecurityService } from '../../src/base/security/services/SecurityService';

export const buildApp = async (): Promise<NestExpressApplication> => {
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

export interface ServerMeta {
  port: number;
  pid: number;
  fileVersion: 1;
}

export const metaFile = path.join(
  process.cwd(),
  'test',
  'e2e',
  '.e2e-server.json',
);
