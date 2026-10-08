import { BlogPostStatus } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import BlogListingPage, { generateMetadata } from '~/app/[locale]/blog/page';

vi.mock('~/i18n/routing', () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async () => (key: string) =>
    ({
      title: 'Blog',
      subtitle: 'Notes on TypeScript.',
      empty: 'No posts published yet.',
      description: 'Technical articles.',
    })[key],
}));

function publishedPost(slug = 'hello-blog'): BlogPostBuilder {
  const localized = (prefix: string) => ({
    'en-US': `${prefix} ${slug}`,
    'pt-BR': `${prefix} ${slug}`,
    es: `${prefix} ${slug}`,
  });
  return BlogPostBuilder.build()
    .withSlug(slug)
    .withTitle(localized('Title'))
    .withDescription(localized('Description'))
    .withStatus(BlogPostStatus.PUBLISHED);
}

const findAll = vi.fn();

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({
    blogPostRepository: { findAll: () => findAll(), findBySlug: vi.fn() },
  }),
}));

async function renderPage(locale = 'en-US') {
  return render(await BlogListingPage({ params: Promise.resolve({ locale }) }));
}

describe('BlogListingPage', () => {
  it('should render a card per post with title, description and tags', async () => {
    findAll.mockResolvedValue([publishedPost().now()]);

    await renderPage();

    expect(screen.getByText('Title hello-blog')).toBeInTheDocument();
    expect(screen.getByText('Description hello-blog')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
  });

  it('should link each card to its dated post route', async () => {
    findAll.mockResolvedValue([
      publishedPost().withPublishedAt('2026-08-01').now(),
    ]);

    await renderPage();

    expect(
      screen.getByRole('link', { name: /Title hello-blog/ }),
    ).toHaveAttribute('href', '/blog/2026/08/hello-blog');
  });

  it('should format the published date for the active locale', async () => {
    findAll.mockResolvedValue([
      publishedPost().withPublishedAt('2026-08-01').now(),
    ]);

    const { container } = await renderPage('pt-BR');
    const time = container.querySelector('time');

    expect(time).toHaveAttribute('datetime', '2026-08-01');
    expect(time?.textContent).toBe(
      new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(new Date('2026-08-01')),
    );
  });

  it('should render the thumbnail when the post has one', async () => {
    findAll.mockResolvedValue([
      publishedPost()
        .withThumbnailImage({
          url: 'https://cdn/thumb.webp',
          alt: { 'en-US': 'Thumb', 'pt-BR': 'Miniatura', es: 'Miniatura' },
        })
        .now(),
    ]);

    await renderPage();

    expect(screen.getByRole('img', { name: 'Thumb' })).toHaveAttribute(
      'src',
      'https://cdn/thumb.webp',
    );
  });

  it('should not render an image when the post has no thumbnail', async () => {
    findAll.mockResolvedValue([publishedPost().now()]);

    await renderPage();

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render the empty state when there are no posts', async () => {
    findAll.mockResolvedValue([]);

    await renderPage();

    expect(screen.getByText('No posts published yet.')).toBeInTheDocument();
  });

  it('should render the empty state when the repository throws', async () => {
    findAll.mockRejectedValue(new Error('fs error'));

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
