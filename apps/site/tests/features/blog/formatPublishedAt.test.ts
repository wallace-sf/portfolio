import { describe, expect, it } from 'vitest';

import { formatPublishedAt } from '~features/blog/formatPublishedAt';

describe('formatPublishedAt', () => {
  it('should format the date in long style for en-US', () => {
    expect(formatPublishedAt('2026-08-01', 'en-US')).toBe('August 1, 2026');
  });

  it('should format the date for the given locale', () => {
    expect(formatPublishedAt('2026-08-01', 'pt-BR')).toBe(
      '1 de agosto de 2026',
    );
    expect(formatPublishedAt('2026-08-01', 'es')).toBe('1 de agosto de 2026');
  });

  it('should keep a date-only string on its own day (formatter pinned to UTC)', () => {
    // `new Date('2026-08-01')` is UTC midnight; a formatter left on a
    // negative-offset local timezone would render it as July 31. The helper
    // passes `timeZone: 'UTC'` so the day never rolls back.
    expect(formatPublishedAt('2026-08-01', 'en-US')).toBe('August 1, 2026');
    expect(formatPublishedAt('2026-03-01', 'en-US')).toBe('March 1, 2026');
  });
});
