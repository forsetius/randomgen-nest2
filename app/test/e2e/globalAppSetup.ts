import * as fs from 'node:fs';
import { buildApp, metaFile, ServerMeta } from './buildApp';

export default async function globalAppCreate(): Promise<void> {
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
