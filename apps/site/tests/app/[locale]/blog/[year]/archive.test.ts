import { describe, expect, it, vi } from 'vitest';

import {
  parseMonthSegment,
  parseYearSegment,
} from '~/app/[locale]/blog/[year]/archive';

vi.mock('~/lib/server/container', () => ({ getServerContainer: vi.fn() }));

describe('parseYearSegment', () => {
  it('should return the year when the segment is a 4-digit year', () => {
    expect(parseYearSegment('2026')).toBe(2026);
  });

  it.each(['26', '20266', 'abc', '2026a', ''])(
    'should return undefined when the segment is %j',
    (segment) => {
      expect(parseYearSegment(segment)).toBeUndefined();
    },
  );
});

describe('parseMonthSegment', () => {
  it.each([
    ['01', 1],
    ['09', 9],
    ['12', 12],
  ])('should return %j as month %i', (segment, month) => {
    expect(parseMonthSegment(segment)).toBe(month);
  });

  it.each(['9', '00', '13', '1a', ''])(
    'should return undefined when the segment is %j (only the zero-padded form the routes emit)',
    (segment) => {
      expect(parseMonthSegment(segment)).toBeUndefined();
    },
  );
});
