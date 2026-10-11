import { type BlogPost, BlogPostStatus } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import sitemap from '~/app/sitemap';

let posts: BlogPost[] = [];

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({
    projectRepository: { findPublished: async () => [] },
    skillRepository: { findNamesByIds: async () => [] },
    blogPostRepository: {
      findAll: async () => posts,
      findBySlug: async () => null,
    },
  }),
}));

const post = (slug: string, publishedAt: string, status: BlogPostStatus) =>
  BlogPostBuilder.build()
    .withSlug(slug)
    .withPublishedAt(publishedAt)
    .withStatus(status)
    .now();

const blogUrls = async () =>
  (await sitemap())
    .map(({ url }) => url)
    .filter((url) => /\/blog\/\d{4}\/\d{2}\/[a-z]/.test(url));

const archiveUrls = async () =>
  (await sitemap())
    .map(({ url }) => url)
    .filter((url) => /\/blog\/\d{4}(\/\d{2})?$/.test(url));

beforeEach(() => {
  posts = [];
});

describe('sitemap', () => {
  it('should list every published post at its dated URL in every locale', async () => {
    posts = [
      post('hello-blog', '2026-09-02T10:00:00.000Z', BlogPostStatus.PUBLISHED),
    ];

    const urls = await blogUrls();

    expect(urls).toEqual(
      ['en-US', 'pt-BR', 'es'].map((locale) =>
        expect.stringMatching(
          new RegExp(`/${locale}/blog/2026/09/hello-blog$`),
        ),
      ),
    );
  });

  it('should leave out posts that are not published', async () => {
    posts = [post('a-draft', '2026-09-02T10:00:00.000Z', BlogPostStatus.DRAFT)];

    expect(await blogUrls()).toEqual([]);
  });

  it('should not list the undated post URLs', async () => {
    posts = [
      post('hello-blog', '2026-09-02T10:00:00.000Z', BlogPostStatus.PUBLISHED),
    ];

    const urls = (await sitemap()).map(({ url }) => url);

    expect(urls.some((url) => url.endsWith('/blog/hello-blog'))).toBe(false);
  });

  it('should list the year and month archives of published posts in every locale', async () => {
    posts = [
      post('september', '2026-09-02T10:00:00.000Z', BlogPostStatus.PUBLISHED),
      post('december', '2025-12-24T10:00:00.000Z', BlogPostStatus.PUBLISHED),
      post('a-draft', '2024-03-01T10:00:00.000Z', BlogPostStatus.DRAFT),
    ];

    const urls = (await archiveUrls()).map((url) => new URL(url).pathname);

    expect(urls.filter((url) => url.startsWith('/pt-BR/'))).toEqual([
      '/pt-BR/blog/2026',
      '/pt-BR/blog/2026/09',
      '/pt-BR/blog/2025',
      '/pt-BR/blog/2025/12',
    ]);
    expect(urls).toHaveLength(12);
  });
});
