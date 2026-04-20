import type { Config } from 'jest';
import tsconfig from '../tsconfig.json';
import { APP_CONFIG_ENV_PREFIX } from '../src/app/config/appConfigEnvPrefix';
import { loadEnvFile } from '../src/shared/util/loadEnvFile';

loadEnvFile('.env.test', true, APP_CONFIG_ENV_PREFIX);

function pathsToMapper(): Record<string, string> {
  const paths = tsconfig.compilerOptions.paths;
  const out: Record<string, string> = {};
  for (const [key, values] of Object.entries(paths)) {
    const pattern = '^' + key.replace('*', '(.*)') + '$';

    out[pattern] = '<rootDir>/../' + values[0]!.replace('*', '$1');
  }
  return out;
}

const config: Config = {
  testEnvironment: 'node',
  rootDir: '.',
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          transform: { decoratorMetadata: true },
          target: 'es2022',
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  moduleNameMapper: pathsToMapper(),
};

export default config;
