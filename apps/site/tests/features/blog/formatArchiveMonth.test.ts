import { describe, expect, it } from 'vitest';

import { formatArchiveMonth } from '~features/blog/formatArchiveMonth';

describe('formatArchiveMonth', () => {
  it.each([
    ['en-US', 'September'],
    ['pt-BR', 'setembro'],
    ['es', 'septiembre'],
  ])(
    'should return the month name as written in a sentence when the locale is %s',
    (locale, expected) => {
      expect(formatArchiveMonth(2026, 9, locale)).toBe(expected);
    },
  );

  it.each([
    ['pt-BR', 'Setembro'],
    ['es', 'Septiembre'],
  ])(
    'should capitalize the month name when a standalone label is requested in %s',
    (locale, expected) => {
      expect(formatArchiveMonth(2026, 9, locale, { capitalized: true })).toBe(
        expected,
      );
    },
  );

  it('should not shift to the previous month when formatting the first month', () => {
    expect(formatArchiveMonth(2026, 1, 'en-US')).toBe('January');
  });
});
