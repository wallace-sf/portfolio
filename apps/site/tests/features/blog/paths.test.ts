import { describe, expect, it } from 'vitest';

import {
  blogArchivePath,
  blogPostPath,
  publicationSegments,
} from '~features/blog/paths';

describe('publicationSegments', () => {
  it('should return a 4-digit year and a zero-padded month when the month is single-digit', () => {
    expect(publicationSegments('2026-01-15T10:00:00.000Z')).toEqual({
      year: '2026',
      month: '01',
    });
  });

  it('should use UTC when publishedAt carries a negative offset across a month boundary', () => {
    expect(publicationSegments('2026-08-31T23:30:00-03:00')).toEqual({
      year: '2026',
      month: '09',
    });
  });

  it('should use UTC when publishedAt carries a positive offset across a year boundary', () => {
    expect(publicationSegments('2027-01-01T01:00:00+03:00')).toEqual({
      year: '2026',
      month: '12',
    });
  });
});

describe('blogPostPath', () => {
  it('should build a dated, locale-agnostic post path when given a publication date and slug', () => {
    expect(blogPostPath('2026-09-02T10:00:00.000Z', 'hello-blog')).toBe(
      '/blog/2026/09/hello-blog',
    );
  });
});

describe('blogArchivePath', () => {
  it('should build the year archive path when no month is given', () => {
    expect(blogArchivePath(2026)).toBe('/blog/2026');
  });

  it('should build the month archive path with a zero-padded month when a month is given', () => {
    expect(blogArchivePath(2026, 9)).toBe('/blog/2026/09');
  });
});
