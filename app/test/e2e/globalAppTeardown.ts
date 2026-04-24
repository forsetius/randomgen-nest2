import * as fs from 'node:fs';
import path from 'node:path';
import { getE2eGlobalRegistry, metaFile, type ServerMeta } from './buildApp';
import { APP_ROOT } from '../../src/appConstants';

const temporaryE2eDirectory = path.join(APP_ROOT, 'test', 'e2e', '.tmp');

function isInsideTemporaryE2eDirectory(directory: string): boolean {
  const relativeDirectory = path.relative(temporaryE2eDirectory, directory);

  return (
    relativeDirectory !== '' &&
    !relativeDirectory.startsWith('..') &&
    !path.isAbsolute(relativeDirectory)
  );
}

function resolveCmsFixtureDirectory(): string | undefined {
  const registryDirectory =
    getE2eGlobalRegistry().__randomgenE2eCmsFixtureDirectory__;

  if (typeof registryDirectory === 'string') {
    return registryDirectory;
  }

  try {
    const rawMeta = fs.readFileSync(metaFile, 'utf-8');
    const meta = JSON.parse(rawMeta) as Partial<ServerMeta>;

    return typeof meta.cmsFixtureDirectory === 'string'
      ? meta.cmsFixtureDirectory
      : undefined;
  } catch {
    return undefined;
  }
}

export default async function globalAppTeardown(): Promise<void> {
  const e2eGlobalRegistry = getE2eGlobalRegistry();
  const app = e2eGlobalRegistry.__randomgenE2eApp__;

  if (typeof app !== 'undefined') {
    await app.close();
    delete e2eGlobalRegistry.__randomgenE2eApp__;
  }

  const cmsFixtureDirectory = resolveCmsFixtureDirectory();

  if (typeof cmsFixtureDirectory !== 'undefined') {
    if (isInsideTemporaryE2eDirectory(cmsFixtureDirectory)) {
      fs.rmSync(cmsFixtureDirectory, { recursive: true, force: true });
    }

    delete e2eGlobalRegistry.__randomgenE2eCmsFixtureDirectory__;
  }

  try {
    fs.unlinkSync(metaFile);
  } catch {
    // ignore (no meta file)
  }
}
