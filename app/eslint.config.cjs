const { defineConfig } = require('eslint/config');

function requireDefault(moduleName) {
  const mod = require(moduleName);

  return mod.default ?? mod;
}

const js = requireDefault('@eslint/js');
const json = requireDefault('@eslint/json');
const n = requireDefault('eslint-plugin-n');
const regexp = requireDefault('eslint-plugin-regexp');
const security = requireDefault('eslint-plugin-security');
const tseslint = requireDefault('typescript-eslint');
const yml = requireDefault('eslint-plugin-yml');
const zod = requireDefault('eslint-plugin-zod');

const tsConfigs = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
].map((config) => ({
  ...config,
  files: ['**/*.ts'],
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...config.languageOptions?.parserOptions,
      projectService: true,
      tsconfigRootDir: __dirname,
      warnOnUnsupportedTypeScriptVersion: false,
    },
  },
}));

const browserGlobals = {
  console: 'readonly',
  document: 'readonly',
  Event: 'readonly',
  fetch: 'readonly',
  history: 'readonly',
  URLSearchParams: 'readonly',
  window: 'readonly',
};

module.exports = defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.d.ts',
      '**/*.tgz',
      '**/coverage/**',
    ],
  },

  // JSON files
  {
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },

  // YAML files
  ...yml.configs['flat/recommended'],

  // JS files
  {
    files: ['**/*.{js,cjs,mjs}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
      'n/no-deprecated-api': 'error',
      'n/prefer-node-protocol': 'error',
    },
    plugins: {
      n,
    },
    settings: {
      node: {
        version: '>=24.15.0 <25',
      },
    },
  },

  // Browser JS assets
  {
    files: ['content/cms/static/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: browserGlobals,
    },
  },
  {
    files: ['content/cms/static/ui/pager-set.js'],
    languageOptions: {
      globals: {
        loadFragment: 'readonly',
        qs: 'readonly',
      },
    },
  },
  {
    files: ['content/cms/static/ui/search.js'],
    rules: {
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^handleSearchResponse$' },
      ],
    },
  },

  // RegExp
  {
    ...regexp.configs['flat/recommended'],
    files: ['**/*.{ts,js,cjs,mjs}'],
  },

  // Security
  {
    files: ['**/*.{ts,js,cjs,mjs}'],
    plugins: {
      security,
    },
    rules: {
      'security/detect-bidi-characters': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-new-buffer': 'error',
      'security/detect-pseudoRandomBytes': 'error',
    },
  },

  // TS files
  ...tsConfigs,
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.scripts.json',
        projectService: false,
        tsconfigRootDir: __dirname,
      },
    },
  },

  // TS, Zod and misc Node
  {
    files: ['**/*.ts'],
    plugins: {
      n,
      zod,
    },
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'n/no-deprecated-api': 'error',
      'n/prefer-node-protocol': 'error',
      'zod/no-any-schema': 'error',
      'zod/no-empty-custom-schema': 'error',
      'zod/no-optional-and-default-together': 'error',
      'zod/no-throw-in-refine': 'error',
      'zod/require-error-message': 'error',
    },
    settings: {
      node: {
        version: '>=24.15.0 <25',
      },
    },
  },
  {
    files: ['scripts/**/*.ts'],
    rules: {
      'n/prefer-node-protocol': 'off',
    },
  },
]);
