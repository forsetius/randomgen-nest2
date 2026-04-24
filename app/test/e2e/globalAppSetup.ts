import * as fs from 'node:fs';
import path from 'node:path';
import {
  buildApp,
  getE2eGlobalRegistry,
  metaFile,
  type ServerMeta,
} from './buildApp';
import { APP_CONFIG_ENV_PREFIX, APP_ROOT } from '../../src/appConstants';
import { loadEnvFile } from '../../src/shared/util/loadEnvFile';

loadEnvFile('.env.test', true, APP_CONFIG_ENV_PREFIX);

const cmsSourceEnvironmentVariable = `${APP_CONFIG_ENV_PREFIX}CMS_SOURCE_DIR`;
const sourceCmsFixtureDirectory = path.join(
  APP_ROOT,
  'test',
  'e2e',
  'cms',
  '_fixtures',
);
const temporaryE2eDirectory = path.join(APP_ROOT, 'test', 'e2e', '.tmp');

function shouldCopyCmsFixturePath(sourcePath: string): boolean {
  const relativeSourcePath = path.relative(
    sourceCmsFixtureDirectory,
    sourcePath,
  );
  const pagesDirectory = path.join('static', 'pages');

  return (
    relativeSourcePath !== pagesDirectory &&
    !relativeSourcePath.startsWith(`${pagesDirectory}${path.sep}`)
  );
}

function createTemporaryCmsFixtureDirectory(): string {
  const cmsFixtureDirectory = path.join(
    temporaryE2eDirectory,
    `cms-${process.pid.toString()}-${Date.now().toString()}`,
  );

  fs.mkdirSync(temporaryE2eDirectory, { recursive: true });
  fs.cpSync(sourceCmsFixtureDirectory, cmsFixtureDirectory, {
    recursive: true,
    filter: shouldCopyCmsFixturePath,
  });
  fs.mkdirSync(path.join(cmsFixtureDirectory, 'static', 'pages'), {
    recursive: true,
  });

  return cmsFixtureDirectory;
}

export default async function globalAppCreate(): Promise<void> {
  const cmsFixtureDirectory = createTemporaryCmsFixtureDirectory();

  process.env[cmsSourceEnvironmentVariable] = path.relative(
    APP_ROOT,
    cmsFixtureDirectory,
  );
  getE2eGlobalRegistry().__randomgenE2eCmsFixtureDirectory__ =
    cmsFixtureDirectory;

  const app = await buildApp();
  getE2eGlobalRegistry().__randomgenE2eApp__ = app;

  // Start on an ephemeral port chosen by OS
  await app.listen(0);
  const url = await app.getUrl();

  const meta: ServerMeta = {
    port: Number(new URL(url).port),
    cmsFixtureDirectory,
    fileVersion: 1,
  };

  fs.writeFileSync(metaFile, JSON.stringify(meta), { encoding: 'utf-8' });
}
