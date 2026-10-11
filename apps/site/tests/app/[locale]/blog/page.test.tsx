import type { IBlogPostRepository } from '@repo/application/blog';
import { type BlogPost, BlogPostStatus } from '@repo/core/blog';
import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogListingPage, { generateMetadata } from '~/app/[locale]/blog/page';

import { blogPost } from '../../../helpers/blogPosts';
import { renderServerComponent } from '../../../helpers/renderServerComponent';

// Real components, real message catalogues and the real next-intl `Link`;
// only boundaries (next-intl server APIs, next/image, the container) are mocked.

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

let posts: BlogPost[] = [];
let failure: Error | null = null;

const inMemoryRepository: IBlogPostRepository = {
  findAll: async () => {
    if (failure) throw failure;
    return posts;
  },
  findBySlug: async () => null,
};

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({ blogPostRepository: inMemoryRepository }),
}));

const renderPage = (locale = 'en-US') =>
  renderServerComponent(
    BlogListingPage({ params: Promise.resolve({ locale }) }),
    { locale },
  );

const renderedCardLinks = () =>
  within(screen.getByRole('list'))
    .getAllByRole('link')
    .map((link) => link.getAttribute('href'));

beforeEach(() => {
  failure = null;
  posts = [
    blogPost('older-post', '2026-08-01T10:00:00.000Z').now(),
    blogPost(
      'draft-post',
      '2026-09-20T10:00:00.000Z',
      BlogPostStatus.DRAFT,
    ).now(),
    blogPost('newest-post', '2026-09-28T10:00:00.000Z').now(),
    blogPost(
      'archived-post',
      '2026-09-10T10:00:00.000Z',
      BlogPostStatus.ARCHIVED,
    ).now(),
  ];
});

describe('BlogListingPage', () => {
  it('should list only published posts, newest first, when posts have mixed statuses', async () => {
    await renderPage();

    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent),
    ).toEqual(['Title newest-post', 'Title older-post']);
    expect(screen.queryByText(/draft-post|archived-post/)).toBeNull();
  });

  it('should link each card to its dated, locale-prefixed post route when a locale is active', async () => {
    await renderPage('pt-BR');

    expect(renderedCardLinks()).toEqual([
      '/pt-BR/blog/2026/09/newest-post',
      '/pt-BR/blog/2026/08/older-post',
    ]);
    expect(screen.getByText('Title newest-post (pt)')).toBeInTheDocument();
  });

  it('should format the published date for the active locale', async () => {
    posts = [blogPost('only-post', '2026-08-01T10:00:00.000Z').now()];

    const { container } = await renderPage('es');
    const time = container.querySelector('time');

    expect(time).toHaveAttribute('datetime', '2026-08-01T10:00:00.000Z');
    expect(time?.textContent).toBe(
      new Intl.DateTimeFormat('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(new Date('2026-08-01T10:00:00.000Z')),
    );
  });

  it('should render the thumbnail only for posts that have one', async () => {
    posts = [
      blogPost('with-thumb', '2026-09-01T10:00:00.000Z')
        .withThumbnailImage({
          url: 'https://cdn/thumb.webp',
          alt: { 'en-US': 'Thumb', 'pt-BR': 'Miniatura', es: 'Miniatura' },
        })
        .now(),
      blogPost('without-thumb', '2026-08-01T10:00:00.000Z').now(),
    ];

    await renderPage();

    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Thumb' })).toHaveAttribute(
      'src',
      'https://cdn/thumb.webp',
    );
  });

  it('should render the empty state when no post is published', async () => {
    posts = posts.filter((post) => post.status !== BlogPostStatus.PUBLISHED);

    await renderPage('pt-BR');

    expect(
      screen.getByText('Nenhum post publicado ainda.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('should render the empty state when the repository fails', async () => {
    failure = new Error('fs error');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await renderPage();

    expect(screen.getByText('No posts published yet.')).toBeInTheDocument();
  });
});

describe('generateMetadata', () => {
  it('should return title and description from the Metadata.BlogPage namespace', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en-US' }),
    });

    expect(metadata.title).toBe('Blog');
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toContain('/en-US/blog');
  });
});
