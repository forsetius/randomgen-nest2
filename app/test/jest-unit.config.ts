import type { Config } from 'jest';
import createBaseConfig from './jest-base.config';

const config: Config = {
  ...createBaseConfig,
  testMatch: ['<rootDir>/unit/**/*.test.ts'],
  passWithNoTests: true,
};

export default config;
