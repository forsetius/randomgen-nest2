import * as fs from 'node:fs';
import { metaFile, ServerMeta } from './buildApp';

export default function globalAppTeardown(): void {
  try {
    const raw = fs.readFileSync(metaFile, 'utf-8');
    const meta = JSON.parse(raw) as ServerMeta;

    // Ask the setup process to close the Nest app gracefully
    try {
      process.kill(meta.pid, 'SIGTERM');
    } catch {
      // ignore (already gone)
    }
  } catch {
    // ignore (no meta file)
  } finally {
    try {
      fs.unlinkSync(metaFile);
    } catch {
      // ignore
    }
  }
}
