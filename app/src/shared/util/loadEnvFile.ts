import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { APP_ROOT } from '../../appConstants';

const loadedEnvFileKeys = new Set<string>();

export class EnvFileNotFoundError extends Error {
  public constructor(public readonly envFilePath: string) {
    super(`Env file ${envFilePath} does not exist`);
  }
}

export function loadEnvFile(
  envFile = '.env',
  overwrite = false,
  keyPrefix = '',
): void {
  const loadKey = `${envFile}:${overwrite ? 'overwrite' : 'skip-existing'}:${keyPrefix}`;

  if (loadedEnvFileKeys.has(loadKey)) {
    return;
  }
  loadedEnvFileKeys.add(loadKey);

  const envFilePath = resolve(APP_ROOT, envFile);
  if (!existsSync(envFilePath)) {
    throw new EnvFileNotFoundError(envFilePath);
  }

  const envValues = parseEnv(readFileSync(envFilePath, 'utf8'));

  for (const [key, value] of Object.entries(envValues)) {
    const targetKey = `${keyPrefix}${key}`;

    if (overwrite || !(targetKey in process.env)) {
      process.env[targetKey] = value;
    }
  }
}
