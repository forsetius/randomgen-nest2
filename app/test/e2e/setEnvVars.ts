import fs from 'node:fs';
import { join } from 'node:path';

const envVarsFile = fs.readFileSync(
  join(__dirname, '../../.env.test'),
  'utf-8',
);
envVarsFile
  .split('\n')
  .map((line) => line.split('=') as [string, string])
  .forEach(([key, value]) => {
    process.env[key] = value;
  });
