import type { IBlogPostRepository } from '@repo/application/blog';
import { type BlogPost, BlogPostStatus } from '@repo/core/blog';
import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogYearArchivePage, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from '~/app/[locale]/blog/[year]/page';

import { blogPost } from '../../../../helpers/blogPosts';
import { renderServerComponent } from '../../../../helpers/renderServerComponent';

// Real components, real message catalogues; only boundaries are mocked.

vi.mock(
  'next-intl/server',
  async () =>
    (await import('../../../../helpers/intlServerMock')).intlServerMock,
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

const params = (year: string, locale = 'en-US') =>
  Promise.resolve({ locale, year });

const renderPage = (year: string, locale = 'en-US') =>
  renderServerComponent(BlogYearArchivePage({ params: params(year, locale) }), {
    locale,
  });

beforeEach(() => {
  posts = [
    blogPost('october-post', '2026-10-01T10:00:00.000Z').now(),
    blogPost('september-early', '2026-09-02T10:00:00.000Z').now(),
    blogPost('september-late', '2026-09-28T10:00:00.000Z').now(),
    blogPost(
      'september-draft',
      '2026-09-20T10:00:00.000Z',
      BlogPostStatus.DRAFT,
    ).now(),
    blogPost('last-year', '2025-12-24T10:00:00.000Z').now(),
  ];
});

describe('BlogYearArchivePage', () => {
  it('should render one section per month, newest first, when the year has posts', async () => {
    await renderPage('2026');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Posts from 2026' }),
    ).toBeInTheDocument();

    const monthHeadings = screen
      .getAllByRole('heading', { level: 2 })
      .map((heading) => heading.textContent);
    expect(monthHeadings).toEqual(['October', 'September']);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Title october-post' }),
    ).toBeInTheDocument();
  });

  it('should link each month heading to its month archive and show its post count', async () => {
    await renderPage('2026', 'pt-BR');

    const september = screen.getByRole('link', { name: 'Setembro' });
    expect(september).toHaveAttribute('href', '/pt-BR/blog/2026/09');

    const section = september.closest('section')!;
    expect(within(section).getByText('2 posts')).toBeInTheDocument();
  });

  it("should list only the year's published posts, newest first, with dated links", async () => {
    await renderPage('2026');

    const cardLinks = screen
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'))
      .filter((href) => href?.split('/').length === 6);

    expect(cardLinks).toEqual([
      '/en-US/blog/2026/10/october-post',
      '/en-US/blog/2026/09/september-late',
      '/en-US/blog/2026/09/september-early',
    ]);
  });

  it('should call notFound when the year has no published posts', async () => {
    posts = [
      blogPost(
        'a-draft',
        '2024-05-01T10:00:00.000Z',
        BlogPostStatus.DRAFT,
      ).now(),
    ];

    await expect(renderPage('2024')).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(renderPage('1999')).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

describe('year archive routing', () => {
  it('should only serve prerendered params when an unknown year is requested', () => {
    expect(dynamicParams).toBe(false);
  });

  it('should emit every locale × year that has published posts', async () => {
    expect(await generateStaticParams()).toEqual([
      { locale: 'en-US', year: '2026' },
      { locale: 'en-US', year: '2025' },
      { locale: 'pt-BR', year: '2026' },
      { locale: 'pt-BR', year: '2025' },
      { locale: 'es', year: '2026' },
      { locale: 'es', year: '2025' },
    ]);
  });

  it('should localize the title and point canonical at the year archive', async () => {
    const metadata = await generateMetadata({ params: params('2026', 'es') });

    expect(metadata.title).toBe('Publicaciones de 2026');
    expect(metadata.alternates?.canonical).toMatch(/\/es\/blog\/2026$/);
  });
});
