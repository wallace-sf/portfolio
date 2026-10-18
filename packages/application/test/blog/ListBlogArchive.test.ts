import { BlogPost } from '@repo/core/blog';
import { BlogPostBuilder, unwrap } from '@repo/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { ListBlogArchive } from '~/blog/use-cases/ListBlogArchive';
import { ListBlogPosts } from '~/blog/use-cases/ListBlogPosts';

import { makeBlogPostRepository } from './helpers/makeBlogPostRepository';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function archiveOf(posts: BlogPost[]) {
  const repo = makeBlogPostRepository({
    findAll: vi.fn().mockResolvedValue(posts),
  });
  return unwrap(await new ListBlogArchive(repo).execute({ locale: 'en-US' }));
}

/** `[year, [month, [slugs]][]][]` — the archive shape without the noise. */
function shapeOf(archive: Awaited<ReturnType<typeof archiveOf>>) {
  return archive.map(({ year, months }) => [
    year,
    months.map(({ month, posts }) => [month, posts.map((p) => p.slug)]),
  ]);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ListBlogArchive', () => {
  describe('execute()', () => {
    it('should group posts by year and month, newest first, when posts span two years', async () => {
      const archive = await archiveOf([
        BlogPostBuilder.published('old-post', '2025-11-20T10:00:00.000Z').now(),
        BlogPostBuilder.published(
          'september-early',
          '2026-09-02T10:00:00.000Z',
        ).now(),
        BlogPostBuilder.published(
          'august-post',
          '2026-08-15T10:00:00.000Z',
        ).now(),
        BlogPostBuilder.published(
          'september-late',
          '2026-09-28T10:00:00.000Z',
        ).now(),
      ]);

      expect(shapeOf(archive)).toEqual([
        [
          2026,
          [
            [9, ['september-late', 'september-early']],
            [8, ['august-post']],
          ],
        ],
        [2025, [[11, ['old-post']]]],
      ]);
    });

    it('should count posts per year and per month when grouping', async () => {
      const archive = await archiveOf([
        BlogPostBuilder.published('post-a', '2026-09-02T10:00:00.000Z').now(),
        BlogPostBuilder.published('post-b', '2026-09-28T10:00:00.000Z').now(),
        BlogPostBuilder.published('post-c', '2026-08-15T10:00:00.000Z').now(),
      ]);

      expect(archive[0]).toMatchObject({
        year: 2026,
        count: 3,
        months: [
          { month: 9, count: 2 },
          { month: 8, count: 1 },
        ],
      });
    });

    it('should exclude DRAFT and ARCHIVED posts from groups and counts when listing', async () => {
      const archive = await archiveOf([
        BlogPostBuilder.published('live', '2026-09-02T10:00:00.000Z').now(),
        BlogPostBuilder.draft('draft', '2026-09-10T10:00:00.000Z').now(),
        BlogPostBuilder.archived('archived', '2025-01-10T10:00:00.000Z').now(),
      ]);

      expect(shapeOf(archive)).toEqual([[2026, [[9, ['live']]]]]);
      expect(archive[0]?.count).toBe(1);
    });

    it('should derive the period in UTC when publishedAt carries a negative offset', async () => {
      const archive = await archiveOf([
        BlogPostBuilder.published(
          'late-august-local',
          '2026-08-31T23:30:00-03:00',
        ).now(),
      ]);

      expect(shapeOf(archive)).toEqual([[2026, [[9, ['late-august-local']]]]]);
    });

    it('should map posts to the same summary DTO as ListBlogPosts when grouping', async () => {
      const posts = [
        BlogPostBuilder.published(
          'same-shape',
          '2026-09-02T10:00:00.000Z',
        ).now(),
      ];
      const repo = makeBlogPostRepository({
        findAll: vi.fn().mockResolvedValue(posts),
      });

      const archive = await new ListBlogArchive(repo).execute({
        locale: 'pt-BR',
      });
      const list = await new ListBlogPosts(repo).execute({ locale: 'pt-BR' });

      if (archive.isLeft() || list.isLeft()) throw new Error('expected Right');
      expect(archive.value[0]?.months[0]?.posts).toEqual(list.value);
    });

    it('should return an empty array when there are no published posts', async () => {
      const archive = await archiveOf([
        BlogPostBuilder.draft('draft', '2026-09-10T10:00:00.000Z').now(),
      ]);

      expect(archive).toEqual([]);
    });

    it('should return Left(DomainError) with FETCH_FAILED when the repository throws', async () => {
      const repo = makeBlogPostRepository({
        findAll: vi.fn().mockRejectedValue(new Error('db down')),
      });

      const result = await new ListBlogArchive(repo).execute({
        locale: 'en-US',
      });

      expect(result.isLeft()).toBe(true);
      if (!result.isLeft()) return;
      expect(result.value.code).toBe('FETCH_FAILED');
    });
  });
});
