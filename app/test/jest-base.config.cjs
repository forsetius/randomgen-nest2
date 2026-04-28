process.env.NODE_ENV = 'test';

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  rootDir: '.',
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          transform: { decoratorMetadata: true },
          target: 'es2022',
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  moduleNameMapper: {
    '^marked$': '<rootDir>/../node_modules/marked/lib/marked.umd.js',
  },
};

module.exports = config;
