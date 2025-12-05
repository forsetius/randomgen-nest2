import type { Config } from 'jest';
import baseConfig from './jest-base.config';

process.env['TS_NODE_PROJECT'] = 'tsconfig.jest.json';

const baseE2eConfig: Config = {
  ...baseConfig,
  testTimeout: 5_000,
  detectOpenHandles: true,
};

export default baseE2eConfig;
