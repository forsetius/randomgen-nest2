import * as fs from 'node:fs';
import path from 'node:path';
import { buildApp, metaFile, ServerMeta } from './buildApp';
import { APP_CONFIG_ENV_PREFIX } from '../../src/app/config/appConfigEnvPrefix';
import { loadEnvFile } from '../../src/shared/util/loadEnvFile';

loadEnvFile('.env.test', true, APP_CONFIG_ENV_PREFIX);

function resetCmsRenderedPages(): void {
  const cmsSourceDir = process.env[`${APP_CONFIG_ENV_PREFIX}CMS_SOURCE_DIR`];

  if (typeof cmsSourceDir !== 'string' || cmsSourceDir.trim() === '') {
    return;
  }

  const pagesOutputDir = path.join(cmsSourceDir, 'static', 'pages');
  fs.rmSync(pagesOutputDir, { recursive: true, force: true });
  fs.mkdirSync(pagesOutputDir, { recursive: true });
}

export default async function globalAppCreate(): Promise<void> {
  resetCmsRenderedPages();

  const app = await buildApp();

  // Ensure a graceful close on SIGTERM sent from teardown
  process.on('SIGTERM', () => {
    void app.close().then(() => process.exit(0));
  });

  // Start on an ephemeral port chosen by OS
  await app.listen(0);
  const url = await app.getUrl();

  const meta: ServerMeta = {
    port: Number(new URL(url).port),
    pid: process.pid,
    fileVersion: 1,
  };

  fs.writeFileSync(metaFile, JSON.stringify(meta), { encoding: 'utf-8' });
}
