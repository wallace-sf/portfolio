import type { IBlogPostRepository } from '@repo/application/blog';
import { type BlogPost, BlogPostStatus } from '@repo/core/blog';
import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogPostPage from '~/app/[locale]/blog/[year]/[month]/[slug]/page';

import { blogPost } from '../../../../../../helpers/blogPosts';
import { renderServerComponent } from '../../../../../../helpers/renderServerComponent';

// Only true boundaries are mocked: Next/next-intl server APIs, the MDX
// compiler, next/image and the container. Every blog component and the
// next-intl `Link` are real.

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async () => (key: string) =>
    ({
      newerPost: 'Newer post',
      olderPost: 'Older post',
      postNavigation: 'Post navigation',
    })[key],
}));

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <pre>{source}</pre>,
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  notFound: () => notFound(),
}));

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

async function renderPage(
  slug: string,
  year: string,
  month: string,
  locale = 'en-US',
) {
  return renderServerComponent(
    BlogPostPage({ params: params(slug, year, month, locale) }),
    { locale },
  );
}

beforeEach(() => {
  posts = [];
  notFound.mockClear();
});

describe('BlogPostPage', () => {
  it('should render the header and MDX body without navigation when the post is the only one', async () => {
    posts = [
      blogPost('hello-blog', '2026-09-02T10:00:00.000Z')
        .withContent({
          'en-US': 'Body of the post.',
          'pt-BR': 'Corpo do post.',
          es: 'Cuerpo del post.',
        })
        .now(),
    ];

    await renderPage('hello-blog', '2026', '09');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Title hello-blog' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Body of the post.')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should link the newer and older posts with dated, locale-prefixed hrefs when the post is in the middle', async () => {
    posts = [
      blogPost('oldest', '2026-08-08T10:00:00.000Z').now(),
      blogPost('newest', '2026-10-01T10:00:00.000Z').now(),
      blogPost('middle', '2026-09-15T10:00:00.000Z').now(),
    ];

    await renderPage('middle', '2026', '09', 'pt-BR');

    const nav = screen.getByRole('navigation', { name: 'Post navigation' });
    const newer = within(nav).getByText('Newer post').closest('a');
    const older = within(nav).getByText('Older post').closest('a');

    expect(newer).toHaveAttribute('href', '/pt-BR/blog/2026/10/newest');
    expect(newer).toHaveTextContent('Title newest (pt)');
    expect(older).toHaveAttribute('href', '/pt-BR/blog/2026/08/oldest');
    expect(older).toHaveTextContent('Title oldest (pt)');
  });

  it('should skip unpublished posts when choosing the newer and older links', async () => {
    posts = [
      blogPost('older', '2026-09-01T10:00:00.000Z').now(),
      blogPost('current', '2026-09-10T10:00:00.000Z').now(),
      blogPost('draft', '2026-09-20T10:00:00.000Z', BlogPostStatus.DRAFT).now(),
    ];

    await renderPage('current', '2026', '09');

    const nav = screen.getByRole('navigation', { name: 'Post navigation' });
    expect(within(nav).queryByText('Newer post')).not.toBeInTheDocument();
    expect(within(nav).getByText('Older post').closest('a')).toHaveAttribute(
      'href',
      '/en-US/blog/2026/09/older',
    );
  });

  it('should render the cover hero when the post has a cover image', async () => {
    posts = [
      blogPost('with-cover', '2026-09-02T10:00:00.000Z')
        .withCoverImage({
          url: 'https://cdn/cover.webp',
          alt: { 'en-US': 'Cover', 'pt-BR': 'Capa', es: 'Portada' },
        })
        .now(),
    ];

    await renderPage('with-cover', '2026', '09');

    expect(screen.getByRole('img', { name: 'Cover' })).toHaveAttribute(
      'src',
      'https://cdn/cover.webp',
    );
  });

  it('should call notFound when the slug does not exist', async () => {
    await expect(renderPage('missing', '2026', '09')).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });

  it('should call notFound when the post is not published', async () => {
    posts = [
      blogPost(
        'a-draft',
        '2026-09-02T10:00:00.000Z',
        BlogPostStatus.DRAFT,
      ).now(),
    ];

    await expect(renderPage('a-draft', '2026', '09')).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });

  it("should call notFound when the year or month don't match the publication date", async () => {
    posts = [blogPost('hello-blog', '2026-09-02T10:00:00.000Z').now()];

    await expect(renderPage('hello-blog', '2026', '08')).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
    await expect(renderPage('hello-blog', '2025', '09')).rejects.toThrow(
      'NEXT_NOT_FOUND',
    );
  });
});
