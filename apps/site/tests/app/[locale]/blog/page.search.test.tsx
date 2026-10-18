import type { IBlogPostRepository } from '@repo/application/blog';
import type { BlogPost } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogListingPage from '~/app/[locale]/blog/page';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

// The listing page with its search island: real components and catalogues;
// only boundaries (next-intl server APIs, next/navigation, next/image, the
// container) are mocked.

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

let posts: BlogPost[] = [];

const inMemoryRepository: IBlogPostRepository = {
  findAll: async () => posts,
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

const cardTitles = () =>
  screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

beforeEach(() => {
  window.history.replaceState(null, '', '/en-US/blog');
  posts = [
    BlogPostBuilder.published('either-pattern', '2026-09-28T10:00:00.000Z')
      .withTags(['typescript'])
      .now(),
    BlogPostBuilder.published('validator-chain', '2026-08-01T10:00:00.000Z')
      .withTags(['ddd'])
      .now(),
  ];
});

describe('BlogListingPage search', () => {
  it('should render a labelled search box above the full listing when the page loads', async () => {
    await renderPage();

    expect(
      screen.getByRole('search').querySelector('input[type="search"]'),
    ).toBe(screen.getByRole('searchbox', { name: 'Search posts' }));
    expect(
      screen.getByRole('heading', { name: 'All posts' }),
    ).toBeInTheDocument();
  });

  it('should narrow the server-rendered cards to the matches when the reader types', async () => {
    await renderPage();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search posts' }), {
      target: { value: 'ddd' },
    });

    expect(cardTitles()).toEqual(['Title validator-chain']);
    expect(screen.getByText('1 post matches “ddd”')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'All posts' })).toBeNull();
  });

  it('should label the search box in the active locale', async () => {
    await renderPage('pt-BR');

    expect(
      screen.getByRole('searchbox', { name: 'Buscar posts' }),
    ).toBeInTheDocument();
  });

  it('should not render a search box when no post is published', async () => {
    posts = [];

    await renderPage();

    expect(screen.queryByRole('search')).toBeNull();
  });
});
