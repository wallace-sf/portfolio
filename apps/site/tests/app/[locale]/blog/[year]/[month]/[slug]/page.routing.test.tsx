import type { IBlogPostRepository } from '@repo/application/blog';
import { type BlogPost, BlogPostStatus } from '@repo/core/blog';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from '~/app/[locale]/blog/[year]/[month]/[slug]/page';

import { blogPost } from '../../../../../../helpers/blogPosts';

let posts: BlogPost[] = [];

const inMemoryRepository: IBlogPostRepository = {
  findAll: async () => posts,
  findBySlug: async (slug) =>
    posts.find((post) => post.slug.value === slug.value) ?? null,
};

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({ blogPostRepository: inMemoryRepository }),
}));

const params = (slug: string, year: string, month: string, locale = 'en-US') =>
  Promise.resolve({ locale, year, month, slug });

beforeEach(() => {
  posts = [];
});

describe('generateStaticParams', () => {
  it('should only serve prerendered params when an unknown path is requested', () => {
    expect(dynamicParams).toBe(false);
  });

  it('should emit a dated entry per locale for every published post only', async () => {
    posts = [
      blogPost('live', '2026-08-31T23:30:00-03:00').now(),
      blogPost('draft', '2026-07-01T10:00:00.000Z', BlogPostStatus.DRAFT).now(),
    ];

    const staticParams = await generateStaticParams();

    expect(staticParams).toEqual([
      { locale: 'en-US', year: '2026', month: '09', slug: 'live' },
      { locale: 'pt-BR', year: '2026', month: '09', slug: 'live' },
      { locale: 'es', year: '2026', month: '09', slug: 'live' },
    ]);
  });
});

describe('generateMetadata', () => {
  it('should point canonical and OpenGraph at the dated URL when the post exists', async () => {
    posts = [blogPost('hello-blog', '2026-09-02T10:00:00.000Z').now()];

    const metadata = await generateMetadata({
      params: params('hello-blog', '2026', '09'),
    });

    expect(metadata.title).toBe('Title hello-blog');
    expect(metadata.alternates?.canonical).toMatch(
      /\/en-US\/blog\/2026\/09\/hello-blog$/,
    );
    expect(metadata.openGraph).toMatchObject({
      url: expect.stringMatching(/\/en-US\/blog\/2026\/09\/hello-blog$/),
      type: 'article',
    });
  });

  it("should return an empty object when the post doesn't exist at that URL", async () => {
    posts = [blogPost('hello-blog', '2026-09-02T10:00:00.000Z').now()];

    expect(
      await generateMetadata({ params: params('missing', '2026', '09') }),
    ).toEqual({});
    expect(
      await generateMetadata({ params: params('hello-blog', '2026', '08') }),
    ).toEqual({});
  });
});
