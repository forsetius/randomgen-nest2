import type { Config } from 'jest';
import baseE2eConfig from './jest-e2e-base.config';

const config: Config = {
  ...baseE2eConfig,
  testMatch: ['<rootDir>/e2e/**/*.parallel.e2e-test.ts'],
  globalSetup: '<rootDir>/e2e/globalAppSetup.ts',
  globalTeardown: '<rootDir>/e2e/globalAppTeardown.ts',
  setupFilesAfterEnv: ['<rootDir>/e2e/globalAppUrl.ts'],
};

export default config;
