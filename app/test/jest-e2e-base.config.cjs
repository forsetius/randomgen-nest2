const baseConfig = require('./jest-base.config.cjs');

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  testTimeout: 5_000,
  detectOpenHandles: true,
};

module.exports = config;
