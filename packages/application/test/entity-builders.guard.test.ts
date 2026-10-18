/**
 * @vitest-environment node
 */
import { findDirectEntityCreates } from '@repo/core/testing';

// docs/08-TESTING.md → Builders and Factories: outside packages/core, tests
// build domain entities with the @repo/core/testing builders.
describe('test data', () => {
  it('should build domain entities through the builders, never Entity.create()', () => {
    expect(findDirectEntityCreates(new URL('.', import.meta.url))).toEqual([]);
  });
});
