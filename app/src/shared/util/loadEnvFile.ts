import { resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

let isEnvVarsLoaded = false;

export function loadEnvFile(envFile = '.env'): void {
  if (isEnvVarsLoaded) {
    return;
  }
  isEnvVarsLoaded = true;

  const envFilePath = resolve(process.cwd(), envFile);
  if (!existsSync(envFilePath)) {
    return;
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
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    });
}
