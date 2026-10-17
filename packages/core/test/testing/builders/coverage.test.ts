import * as testing from '~/testing';
import { ENTITY_NAMES } from '~/testing';

// Every entity `@repo/core` exports must have a test-data builder
// (docs/08-TESTING.md → Builders and Factories).
describe('test-data builders coverage', () => {
  it('should find the exported entities', () => {
    expect(ENTITY_NAMES).toContain('BlogPost');
    expect(ENTITY_NAMES).toContain('ProfileStat');
    expect(ENTITY_NAMES).not.toContain('Entity');
    expect(ENTITY_NAMES).not.toContain('AggregateRoot');
  });

  it.each(ENTITY_NAMES)(
    'should export a builder for %s from @repo/core/testing',
    (name) => {
      expect(testing).toHaveProperty(`${name}Builder`);
    },
  );
});
