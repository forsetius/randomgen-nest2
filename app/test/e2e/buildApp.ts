import 'tsconfig-paths/register';
import path from 'node:path';
import { SpamCheckService } from '@forsetius/glitnir-spamcheck';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NotFoundFilter } from '../../src/shared/filters/NotFoundFilter';
import { APP_ROOT } from '../../src/appConstants';

type AppModuleType = typeof import('../../src/app/AppModule');

async function loadAppModule(): Promise<AppModuleType['AppModule']> {
  const appModulePath = '../../src/app/AppModule';
  const appModulePackage = (await import(appModulePath)) as AppModuleType;

  return appModulePackage.AppModule;
}

export const buildApp = async (): Promise<NestExpressApplication> => {
  const AppModule = await loadAppModule();
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(SpamCheckService)
    .useValue({
      onApplicationBootstrap: () => Promise.resolve(),
      isSpam: () => Promise.resolve(false),
    })
    .compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();

  app.useGlobalFilters(new NotFoundFilter());

  await app.init();
  return app;
};

export interface ServerMeta {
  port: number;
  cmsFixtureDirectory: string;
  fileVersion: 1;
}

export type E2eGlobalRegistry = typeof globalThis & {
  __randomgenE2eApp__?: NestExpressApplication;
  __randomgenE2eCmsFixtureDirectory__?: string;
};

export function getE2eGlobalRegistry(): E2eGlobalRegistry {
  return globalThis;
}

export const metaFile = path.join(APP_ROOT, 'test', 'e2e', '.e2e-server.json');
