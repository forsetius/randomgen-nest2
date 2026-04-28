const baseConfig = require('./jest-base.config.cjs');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  testMatch: ['<rootDir>/unit/**/*.test.ts'],
  passWithNoTests: true,
};

module.exports = config;
