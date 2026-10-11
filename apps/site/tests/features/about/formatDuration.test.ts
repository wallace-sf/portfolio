import { describe, expect, it } from 'vitest';

import { formatDuration } from '~features/about/formatDuration';

const YEAR_PATTERN = /years?/;
const MONTH_PATTERN = /months?/;

describe('formatDuration', () => {
  it('should include years and months for multi-year range', () => {
    const result = formatDuration('2022-01-01', 'en-US', '2023-04-01');
    expect(result).toMatch(YEAR_PATTERN);
    expect(result).toMatch(MONTH_PATTERN);
  });

  it('should return only years when months is zero', () => {
    const result = formatDuration('2021-03-01', 'en-US', '2023-03-01');
    expect(result).toMatch(YEAR_PATTERN);
    expect(result).not.toMatch(MONTH_PATTERN);
  });

  it('should return only months for sub-year range', () => {
    const result = formatDuration('2023-06-01', 'en-US', '2023-09-01');
    expect(result).not.toMatch(YEAR_PATTERN);
    expect(result).toMatch(MONTH_PATTERN);
  });

  it('should use today when endAt is not provided', () => {
    const result = formatDuration('2020-01-01', 'en-US');
    expect(result).toMatch(
      new RegExp(`${YEAR_PATTERN.source}|${MONTH_PATTERN.source}`),
    );
  });

  it('should return minimum of 1 month when duration rounds to zero', () => {
    const result = formatDuration('2023-01-15', 'en-US', '2023-01-20');
    expect(result).toMatch(MONTH_PATTERN);
  });
});
