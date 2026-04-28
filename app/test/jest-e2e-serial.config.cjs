const baseE2eConfig = require('./jest-e2e-base.config.cjs');

/** @type {import('jest').Config} */
const config = {
  ...baseE2eConfig,
  testMatch: ['e2e/**/*.serial.e2e-test.ts'],
  maxWorkers: 1,
  passWithNoTests: true,
};

module.exports = config;
