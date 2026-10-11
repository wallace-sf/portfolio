const library = require('./library');
const { SRC_PATHS, restrictImports } = require('./restricted-imports');

const restricted = restrictImports([
  SRC_PATHS,
  {
    group: ['react', 'react-dom'],
    message:
      'Application layer cannot import React — violates Clean Architecture dependency rule.',
  },
  {
    group: ['next', 'next/*'],
    message:
      'Application layer cannot import Next.js — violates Clean Architecture dependency rule.',
  },
  {
    group: ['@prisma/*', 'prisma'],
    message:
      'Application layer cannot import Prisma — violates Clean Architecture dependency rule.',
  },
  {
    group: ['axios', 'node-fetch'],
    message:
      'Application layer cannot import HTTP clients — violates Clean Architecture dependency rule.',
  },
  {
    group: ['resend'],
    message:
      'Application layer cannot import Resend — violates Clean Architecture dependency rule.',
  },
]);

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...library,
  overrides: [
    ...library.overrides.filter((override) => !override.rules),
    restricted.testOverride,
  ],
  rules: {
    ...library.rules,
    'no-restricted-imports': restricted.rule,
  },
};
