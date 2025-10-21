const baseConfig = require('./jest-e2e-base.config');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  testMatch: ['**/*.parallel.e2e-test.ts'],
  globalSetup: '<rootDir>/globalAppSetup.ts',
  globalTeardown: '<rootDir>/globalAppTeardown.ts',
  setupFilesAfterEnv: ['<rootDir>/globalAppUrl.ts'],
};

module.exports = config;
