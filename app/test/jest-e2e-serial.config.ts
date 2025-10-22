import type { Config } from 'jest';
import baseE2eConfig from './jest-e2e-base.config';

const config: Config = {
  ...baseE2eConfig,
  testMatch: ['e2e/**/*.serial.e2e-test.ts'],
  maxWorkers: 1,
  passWithNoTests: true,
};

export default config;
