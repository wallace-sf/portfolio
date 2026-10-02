const {
  SRC_PATHS,
  TEST_HELPERS,
} = require('@repo/eslint-config/restricted-imports');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@repo/eslint-config/library.js',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  overrides: [
    {
      // Domain code must not depend on the test-data builders it ships.
      files: ['src/**/*.ts'],
      excludedFiles: ['src/testing/**'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              SRC_PATHS,
              TEST_HELPERS,
              {
                group: ['**/testing', '**/testing/**'],
                message:
                  'src/testing holds test-data builders — domain code must not import it.',
              },
            ],
          },
        ],
      },
    },
  ],
};
