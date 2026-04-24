import type { Config } from 'jest';
import { APP_CONFIG_ENV_PREFIX } from '../src/appConstants';
import { loadEnvFile } from '../src/shared/util/loadEnvFile';

loadEnvFile('.env.test', true, APP_CONFIG_ENV_PREFIX);

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
  moduleNameMapper: {
    '^marked$': '<rootDir>/../node_modules/marked/lib/marked.umd.js',
  },
};

export default config;
