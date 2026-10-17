import type { IBlogPostRepository } from '@repo/application/blog';
import { type BlogPost, BlogPostStatus } from '@repo/core/blog';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogTagsPage, {
  generateMetadata,
  generateStaticParams,
} from '~/app/[locale]/blog/tags/page';

import { blogPost } from '../../../../helpers/blogPosts';
import { expectBreadcrumbTrail } from '../../../../helpers/breadcrumbs';
import { renderServerComponent } from '../../../../helpers/renderServerComponent';

// Real components, real message catalogues; only boundaries are mocked.

vi.mock(
  'next-intl/server',
  async () =>
    (await import('../../../../helpers/intlServerMock')).intlServerMock,
);

let posts: BlogPost[] = [];

const inMemoryRepository: IBlogPostRepository = {
  findAll: async () => posts,
  findBySlug: async () => null,
};

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({ blogPostRepository: inMemoryRepository }),
}));

const params = (locale = 'en-US') => Promise.resolve({ locale });

const renderPage = (locale = 'en-US') =>
  renderServerComponent(BlogTagsPage({ params: params(locale) }), { locale });

beforeEach(() => {
  posts = [
    blogPost('first-post', '2026-09-02T10:00:00.000Z')
      .withTags(['ddd', 'typescript'])
      .now(),
    blogPost('second-post', '2026-09-02T10:00:00.000Z').withTags(['ddd']).now(),
    blogPost('draft-post', '2026-09-02T10:00:00.000Z', BlogPostStatus.DRAFT)
      .withTags(['drafts-only'])
      .now(),
  ];
});

describe('BlogTagsPage', () => {
  it('should list every published tag, most used first, with its count and tag page link', async () => {
    await renderPage('pt-BR');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tags' }),
    ).toBeInTheDocument();

    const links = screen
      .getAllByRole('link')
      .map((link) => [link.textContent, link.getAttribute('href')])
      .filter(([, href]) => href?.startsWith('/pt-BR/blog/tags/'));
    expect(links).toEqual([
      ['ddd · 2', '/pt-BR/blog/tags/ddd'],
      ['typescript · 1', '/pt-BR/blog/tags/typescript'],
    ]);
  });

  it('should show the empty state when no post is published', async () => {
    posts = [
      blogPost('draft-post', '2026-09-02T10:00:00.000Z', BlogPostStatus.DRAFT)
        .withTags(['ddd'])
        .now(),
    ];

    await renderPage();

    expect(screen.getByText('No posts published yet.')).toBeInTheDocument();
  });

  it('should end the breadcrumb at Tags, with matching JSON-LD', async () => {
    const { container } = await renderPage();

    expectBreadcrumbTrail(
      container,
      [
        { label: 'Home', href: '/en-US' },
        { label: 'Blog', href: '/en-US/blog' },
        { label: 'Tags', href: undefined },
      ],
      '/en-US/blog/tags',
    );
  });
});

describe('tag index routing', () => {
  it('should prerender one page per locale', () => {
    expect(generateStaticParams()).toEqual([
      { locale: 'en-US' },
      { locale: 'pt-BR' },
      { locale: 'es' },
    ]);
  });

  it('should localize the title and point canonical at the tag index', async () => {
    const metadata = await generateMetadata({ params: params('es') });

    expect(metadata.title).toBe('Etiquetas');
    expect(metadata.alternates?.canonical).toMatch(/\/es\/blog\/tags$/);
  });
});
