const baseE2eConfig = require('./jest-e2e-base.config.cjs');

/** @type {import('jest').Config} */
const config = {
  ...baseE2eConfig,
  testMatch: ['<rootDir>/e2e/**/*.parallel.e2e-test.ts'],
  globalSetup: '<rootDir>/e2e/globalAppSetup.ts',
  globalTeardown: '<rootDir>/e2e/globalAppTeardown.ts',
  setupFilesAfterEnv: ['<rootDir>/e2e/globalAppUrl.ts'],
};

module.exports = config;
