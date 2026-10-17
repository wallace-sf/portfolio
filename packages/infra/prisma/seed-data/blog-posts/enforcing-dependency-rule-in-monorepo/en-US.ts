export const content = `This monorepo follows one rule above all others: dependencies point inward.

\`\`\`text
core ← application ← infra ← site / admin
\`\`\`

The domain knows nothing about the use cases, the use cases know nothing about Prisma, and only
the apps know about Next.js. A rule like that doesn't hold because it is in a diagram. It holds
where a tool refuses to let it break. Here is where each tool does that, and where nothing does
yet.

## Wall 1: package.json is the dependency graph

Each layer is its own package, and a package can only import what it declares:

\`\`\`jsonc
// packages/core/package.json
"dependencies": { "@repo/utils": "workspace:*", "uuid": "^10.0.0" }

// packages/application/package.json
"dependencies": { "@repo/core": "workspace:*", "@repo/utils": "workspace:*" }
\`\`\`

Adding \`next\` or \`@prisma/client\` to \`core\` is not a quiet import. It is a visible change to a
manifest, and it shows up in review as exactly what it is.

## Wall 2: lint bans frameworks in the application layer

\`application\` gets its own ESLint config with a \`no-restricted-imports\` entry per framework:

\`\`\`js
{
  group: ['@prisma/*', 'prisma'],
  message:
    'Application layer cannot import Prisma — violates Clean Architecture dependency rule.',
},
\`\`\`

React, Next.js, HTTP clients and the email SDK get the same treatment. The message names the rule,
so whoever hits it learns why, not only what.

## Wall 3: only public exports, and test helpers stay in tests

Every package shares two more patterns. \`SRC_PATHS\` forbids reaching into another package's
\`/src\`, so packages talk through their exports. \`TEST_HELPERS\` keeps \`@repo/core/testing\`, the
test-data builders, out of production code. Test files get the same rule without that ban.

## Wall 4: inside the app, features don't reach into routes

\`apps/site\` has the same idea one level down: code in \`src/features/\` may not import from
\`src/app/\`. Route files compose features; features never depend on a route.

## Where the walls stop

Two parts of the rule are still conventions, checked in review:

- **\`core\` has no framework ban in lint.** Only its \`package.json\` keeps React or Prisma out.
- **\`'use client'\` components must not import \`@repo/application\`.** Nothing fails today if one
  does. A \`server-only\` import in the server container would turn that into a build error.

Writing down the gaps is part of the rule. A wall you think exists is worse than one you know is
missing.
`;
