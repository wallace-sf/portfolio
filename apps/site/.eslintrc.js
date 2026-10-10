/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  ignorePatterns: ['*.mjs'],
  overrides: [
    {
      // Source layout (docs/02-ARCHITECTURE.md § apps/site source layout):
      // dependencies go app → features → lib/utils. Route glue lives next to
      // its route in app/, so a feature never reaches back into it.
      files: ['src/features/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['~/app', '~/app/*', '**/app/*'],
                message:
                  'features/ must not import from app/ — move shared code into features/ or lib/.',
              },
            ],
          },
        ],
      },
    },
  ],
};
