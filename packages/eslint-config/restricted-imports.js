/**
 * Shared `no-restricted-imports` building blocks for the configs in this
 * package. Production code (`src/`) may not import package internals or the
 * test-data builders; test files keep every other restriction but may import
 * `@repo/core/testing`.
 */

const SRC_PATHS = {
  group: [
    "@repo/core/src",
    "@repo/core/src/*",
    "@repo/utils/src",
    "@repo/utils/src/*",
    "**/packages/core/src",
    "**/packages/core/src/*",
    "**/packages/utils/src",
    "**/packages/utils/src/*",
  ],
  message: "Import from public package exports, not /src paths.",
};

const TEST_HELPERS = {
  group: ["@repo/core/testing", "@repo/core/testing/*"],
  message:
    "@repo/core/testing holds test-data builders — import it from test files only (see docs/08-TESTING.md).",
};

const TEST_FILES = ["test/**", "tests/**", "**/*.test.ts", "**/*.test.tsx"];

/**
 * Returns the `no-restricted-imports` rule for production code (`patterns`
 * plus the test-helpers ban) and the override that relaxes it for test files.
 */
function restrictImports(patterns) {
  return {
    rule: ["error", { patterns: [...patterns, TEST_HELPERS] }],
    testOverride: {
      files: TEST_FILES,
      rules: { "no-restricted-imports": ["error", { patterns }] },
    },
  };
}

module.exports = { SRC_PATHS, TEST_HELPERS, restrictImports };
