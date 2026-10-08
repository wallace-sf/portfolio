import type { IBlogPostRepository } from '@repo/application/blog';
import { type BlogPost, BlogPostStatus } from '@repo/core/blog';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogMonthArchivePage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from '~/app/[locale]/blog/[year]/[month]/page';

import { blogPost } from '../../../../../helpers/blogPosts';
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

const params = (year: string, month: string, locale = 'en-US') =>
  Promise.resolve({ locale, year, month });

const renderPage = (year: string, month: string, locale = 'en-US') =>
  renderServerComponent(
    BlogMonthArchivePage({ params: params(year, month, locale) }),
    { locale },
  );

beforeEach(() => {
  posts = [
    blogPost('september-early', '2026-09-02T10:00:00.000Z').now(),
    blogPost('september-late', '2026-09-28T10:00:00.000Z').now(),
    blogPost(
      'september-draft',
      '2026-09-20T10:00:00.000Z',
      BlogPostStatus.DRAFT,
    ).now(),
    blogPost('august-post', '2026-08-15T10:00:00.000Z').now(),
  ];
});

describe('BlogMonthArchivePage', () => {
  it('should title the page with the month as written in a sentence for the locale', async () => {
    await renderPage('2026', '09', 'pt-BR');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Posts de setembro de 2026',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 posts')).toBeInTheDocument();
  });

  it("should list only the month's published posts, newest first, with dated links", async () => {
    await renderPage('2026', '09');

    expect(
      screen.getAllByRole('link').map((link) => link.getAttribute('href')),
    ).toEqual([
      '/en-US/blog/2026/09/september-late',
      '/en-US/blog/2026/09/september-early',
    ]);
  });

  it('should use the singular post count when the month has one post', async () => {
    await renderPage('2026', '08', 'es');

    expect(screen.getByText('1 publicación')).toBeInTheDocument();
  });

  it('should call notFound when the month has no published posts', async () => {
    await expect(renderPage('2026', '07')).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(renderPage('2026', '9')).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

describe('month archive routing', () => {
  it('should only serve prerendered params when an unknown month is requested', () => {
    expect(dynamicParams).toBe(false);
  });

  it('should emit every locale × year-month that has published posts', async () => {
    const staticParams = await generateStaticParams();

    expect(staticParams.filter(({ locale }) => locale === 'en-US')).toEqual([
      { locale: 'en-US', year: '2026', month: '09' },
      { locale: 'en-US', year: '2026', month: '08' },
    ]);
    expect(staticParams).toHaveLength(6);
  });

  it('should localize the title and point canonical at the month archive', async () => {
    const metadata = await generateMetadata({
      params: params('2026', '09', 'en-US'),
    });

    expect(metadata.title).toBe('Posts from September 2026');
    expect(metadata.alternates?.canonical).toMatch(/\/en-US\/blog\/2026\/09$/);
  });
});
