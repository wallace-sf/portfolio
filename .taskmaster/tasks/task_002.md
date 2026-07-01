# Task ID: 2

**Title:** Migrate test runner from Jest to Vitest

**Status:** pending

**Dependencies:** None

**Priority:** medium

**Description:** Replace Jest with Vitest as the standard test runner for packages/core to align with monorepo conventions

**Details:**

1. Remove Jest configuration and dependencies:
   - Delete `packages/core/jest.config.ts`
   - Remove from `package.json` devDependencies: `jest`, `ts-jest`, `@types/jest`

2. Add Vitest configuration:
   - Create `packages/core/vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/index.ts'],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});
```

3. Update `package.json` scripts:
   - Change `"test": "jest"` to `"test": "vitest run"`
   - Change `"test:watch": "jest --watchAll --collectCoverage"` to `"test:watch": "vitest"`
   - Add `vitest` to devDependencies

4. Update test files:
   - Replace `describe`, `it`, `expect` imports if any (Vitest globals mode handles this)
   - Verify all existing tests pass with `pnpm test`

**Test Strategy:**

Validation:
- Run `pnpm test` in packages/core and verify all existing tests pass
- Run `pnpm test:watch` to verify watch mode works
- Verify coverage reports are generated correctly
- Check that coverage now includes base classes (Entity.ts, ValueObject.ts) since exclusion was removed

## Subtasks

### 2.1. Remove Jest configuration and dependencies

**Status:** pending  
**Dependencies:** None  

Clean up all Jest-related files and dependencies from packages/core to prepare for Vitest migration

**Details:**

1. Delete `packages/core/jest.config.ts` configuration file
2. Remove Jest dependencies from `packages/core/package.json` devDependencies:
   - `jest`
   - `ts-jest`
   - `@types/jest` (if present)
3. Run `pnpm install` in packages/core to update lockfile
4. Verify no Jest references remain in package.json
5. Commit changes: 'chore(core): remove Jest configuration and dependencies'

### 2.2. Add Vitest configuration with coverage and alias setup

**Status:** pending  
**Dependencies:** 2.1  

Create vitest.config.ts with proper test environment, coverage settings, and path aliases matching project structure

**Details:**

1. Add Vitest to `packages/core/package.json` devDependencies:
   - `vitest` (latest version)
   - `@vitest/coverage-v8` for coverage provider
2. Create `packages/core/vitest.config.ts` with:
   - `globals: true` for describe/it/expect without imports
   - `environment: 'node'` for Node.js runtime
   - `include: ['test/**/*.test.ts']` to match existing test file pattern
   - Coverage configuration with v8 provider, text/json/html reporters
   - Coverage includes src/**/*.ts, excludes src/**/index.ts
   - Path alias `'~': path.resolve(__dirname, './src')` for imports
3. Run `pnpm install` to add Vitest packages
4. Commit changes: 'chore(core): add Vitest configuration with coverage setup'

### 2.3. Update package.json test scripts for Vitest

**Status:** pending  
**Dependencies:** 2.2  

Replace Jest scripts with Vitest equivalents and verify test file compatibility

**Details:**

1. Update `packages/core/package.json` scripts section:
   - Change `"test": "jest"` to `"test": "vitest run"`
   - Change `"test:watch": "jest --watchAll --collectCoverage"` to `"test:watch": "vitest"`
   - Add `"test:coverage": "vitest run --coverage"` for explicit coverage runs
2. Review existing test files in test/**/*.test.ts:
   - Verify no explicit Jest imports (Vitest globals mode handles describe/it/expect)
   - Check for Jest-specific APIs that need replacement (rare with current test structure)
3. Run `pnpm test` to execute all 19 existing test files
4. Document any compatibility issues found
5. Commit changes: 'chore(core): update test scripts to use Vitest'

### 2.4. Run full test suite validation and fix migration issues

**Status:** pending  
**Dependencies:** None  

Execute comprehensive test validation including coverage reports and resolve any Vitest migration issues

**Details:**

1. Run full test suite: `pnpm test` in packages/core
   - Verify all 19 test files pass without errors
   - Check for any timing or async handling differences from Jest
2. Test watch mode: `pnpm test:watch`
   - Verify file watching works correctly
   - Test that changes trigger re-runs
3. Generate coverage reports: `pnpm test:coverage`
   - Verify coverage reports generate in text, json, and html formats
   - Confirm base classes (Entity.ts, ValueObject.ts) are now included in coverage
   - Check coverage thresholds are reasonable
4. Fix any issues found:
   - Adjust test syntax if Vitest behaves differently
   - Update vitest.config.ts if coverage settings need tuning
   - Document any breaking changes or behavioral differences
5. Update root-level turbo.json if test task configuration needs changes
6. Commit changes: 'test(core): validate Vitest migration and fix issues'
7. Update task 2 with final validation results
