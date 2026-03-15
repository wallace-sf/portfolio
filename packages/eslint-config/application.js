const library = require('./library');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...library,
  rules: {
    ...library.rules,
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@repo/core/src', '@repo/core/src/*'],
            message: 'Import from public package exports, not /src paths.',
          },
          {
            group: ['@repo/utils/src', '@repo/utils/src/*'],
            message: 'Import from public package exports, not /src paths.',
          },
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
        ],
      },
    ],
  },
};
