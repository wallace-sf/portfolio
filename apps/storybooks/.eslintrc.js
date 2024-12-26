/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@repo/eslint-config/react.js',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  ignorePatterns: ['*.mjs', 'dist/'],
};
