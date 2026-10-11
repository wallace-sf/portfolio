import type { IBlogPostRepository } from '@repo/application/blog';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  findArchiveMonth,
  findArchiveYear,
  parseMonthSegment,
  parseYearSegment,
} from '~/app/[locale]/blog/[year]/archive';

import { blogPost } from '../../../../helpers/blogPosts';

const repository: IBlogPostRepository = {
  findAll: vi.fn(),
  findBySlug: vi.fn(),
};

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({ blogPostRepository: repository }),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

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

describe('findArchiveYear / findArchiveMonth', () => {
  it('should return the period with its year when it has published posts', async () => {
    vi.mocked(repository.findAll).mockResolvedValue([
      blogPost('hello-blog', '2026-09-02T10:00:00.000Z').now(),
    ]);

    expect((await findArchiveYear('en-US', '2026'))?.count).toBe(1);
    expect(await findArchiveMonth('en-US', '2026', '09')).toMatchObject({
      year: 2026,
      month: 9,
      count: 1,
    });
  });

  it('should return undefined without logging when the period is empty or malformed', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(repository.findAll).mockResolvedValue([]);

    expect(await findArchiveYear('en-US', '2026')).toBeUndefined();
    expect(await findArchiveMonth('en-US', '2026', '9')).toBeUndefined();
    expect(error).not.toHaveBeenCalled();
  });

  it('should return undefined and log the failure when the repository fails', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(repository.findAll).mockRejectedValue(new Error('db down'));

    expect(await findArchiveMonth('en-US', '2026', '09')).toBeUndefined();
    expect(error).toHaveBeenCalledWith(
      '[blog] could not load the month archive:',
      expect.objectContaining({ code: 'FETCH_FAILED' }),
    );
  });
});
