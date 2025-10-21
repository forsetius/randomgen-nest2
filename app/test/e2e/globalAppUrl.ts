import * as fs from 'node:fs';
import { metaFile } from './buildApp';

let cachedBaseUrl: string | null = null;

export const getBaseUrl = (): string => {
  if (cachedBaseUrl) return cachedBaseUrl;

  const raw = fs.readFileSync(metaFile, 'utf-8');
  const meta = JSON.parse(raw) as { port: number };

  cachedBaseUrl = `http://127.0.0.1:${meta.port.toString()}`;

  return cachedBaseUrl;
};
