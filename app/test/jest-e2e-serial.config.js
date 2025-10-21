const baseConfig = require('./jest-e2e-base.config');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  testMatch: ['**/*.serial.e2e-test.ts'],
  maxWorkers: 1,
  passWithNoTests: true,
};

module.exports = config;
