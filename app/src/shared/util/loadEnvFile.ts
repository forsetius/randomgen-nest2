import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { APP_ROOT } from '../../appRoot';

const loadedEnvFileKeys = new Set<string>();

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
    throw new Error(`Env file ${envFilePath} does not exist`);
  }

  const content = readFileSync(envFilePath, 'utf8');
  content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .forEach((line) => {
      const [key, val] = line.split('=').map((part) => part.trim()) as [
        string,
        string | undefined,
      ];
      if (typeof val === 'undefined') {
        return;
      }

      const value = /^"(.*)"$/.exec(val)?.[1] ?? val;
      const targetKey = `${keyPrefix}${key}`;

      if (overwrite || !(targetKey in process.env)) {
        process.env[targetKey] = value;
      }
    });
}
