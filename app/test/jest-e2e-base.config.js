const path = require('node:path');

const rootDir = path.join(__dirname, 'e2e');

/** @type {import('jest').Config} */
const baseConfig = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir,
  setupFiles: ['<rootDir>/setEnvVars.ts'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/../../src/app/$1',
    '^@config/(.*)$': '<rootDir>/../../src/base/config/$1',
    '^@domain/(.*)$': '<rootDir>/../../src/domain/$1',
    '^@shared/(.*)$': '<rootDir>/../../src/shared/$1',
    '^@templating/(.*)$': '<rootDir>/../../src/base/templating/$1',
  },
  testTimeout: 50000,
  detectOpenHandles: true,
};

module.exports = baseConfig;
