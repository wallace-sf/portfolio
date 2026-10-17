import type { IBlogPostRepository } from '@repo/application/blog';
import { type BlogPost, BlogPostStatus } from '@repo/core/blog';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogTagPage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from '~/app/[locale]/blog/tags/[tag]/page';

import { blogPost } from '../../../../../helpers/blogPosts';
import { expectBreadcrumbTrail } from '../../../../../helpers/breadcrumbs';
import { renderServerComponent } from '../../../../../helpers/renderServerComponent';

// Real components, real message catalogues; only boundaries are mocked.

vi.mock(
  'next-intl/server',
  async () =>
    (await import('../../../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

let posts: BlogPost[] = [];

const inMemoryRepository: IBlogPostRepository = {
  findAll: async () => posts,
  findBySlug: async () => null,
};

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({ blogPostRepository: inMemoryRepository }),
}));

const params = (tag: string, locale = 'en-US') =>
  Promise.resolve({ locale, tag });

const renderPage = (tag: string, locale = 'en-US') =>
  renderServerComponent(BlogTagPage({ params: params(tag, locale) }), {
    locale,
  });

beforeEach(() => {
  posts = [
    blogPost('older-ddd', '2026-08-01T10:00:00.000Z').withTags(['ddd']).now(),
    blogPost('newer-ddd', '2026-09-28T10:00:00.000Z')
      .withTags(['ddd', 'typescript'])
      .now(),
    blogPost('nextjs-only', '2026-09-10T10:00:00.000Z')
      .withTags(['nextjs'])
      .now(),
    blogPost('draft-ddd', '2026-09-20T10:00:00.000Z', BlogPostStatus.DRAFT)
      .withTags(['ddd'])
      .now(),
  ];
});

describe('BlogTagPage', () => {
  it("should list the tag's published posts newest first under a #tag heading with their count", async () => {
    await renderPage('ddd');

    expect(
      screen.getByRole('heading', { level: 1, name: '#ddd' }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 posts')).toBeInTheDocument();
    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent),
    ).toEqual(['Title newer-ddd', 'Title older-ddd']);
  });

  it('should end the breadcrumb at #tag under Tags, with matching JSON-LD', async () => {
    const { container } = await renderPage('ddd', 'pt-BR');

    expectBreadcrumbTrail(
      container,
      [
        { label: 'Início', href: '/pt-BR' },
        { label: 'Blog', href: '/pt-BR/blog' },
        { label: 'Tags', href: '/pt-BR/blog/tags' },
        { label: '#ddd', href: undefined },
      ],
      '/pt-BR/blog/tags/ddd',
    );
  });

  it('should call notFound when the tag is unknown, only on drafts, or malformed', async () => {
    await expect(renderPage('unknown-tag')).rejects.toThrow('NEXT_NOT_FOUND');
    posts = [
      blogPost('draft-only', '2026-09-20T10:00:00.000Z', BlogPostStatus.DRAFT)
        .withTags(['secret'])
        .now(),
    ];
    await expect(renderPage('secret')).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(renderPage('Not A Tag')).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

describe('tag page routing', () => {
  it('should only serve prerendered params when an unknown tag is requested', () => {
    expect(dynamicParams).toBe(false);
  });

  it('should emit every locale × published tag', async () => {
    const result = await generateStaticParams();

    expect(result).toHaveLength(3 * 3);
    expect(result).toEqual(
      expect.arrayContaining([
        { locale: 'en-US', tag: 'ddd' },
        { locale: 'pt-BR', tag: 'typescript' },
        { locale: 'es', tag: 'nextjs' },
      ]),
    );
  });

  it('should localize the title and point canonical at the tag page', async () => {
    const metadata = await generateMetadata({ params: params('ddd', 'pt-BR') });

    expect(metadata.title).toBe('Posts com a tag #ddd');
    expect(metadata.alternates?.canonical).toMatch(/\/pt-BR\/blog\/tags\/ddd$/);
  });

  it('should return no metadata when the tag has no published posts', async () => {
    expect(await generateMetadata({ params: params('unknown-tag') })).toEqual(
      {},
    );
  });
});
