import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BlogPost } from '@repo/core/blog';

import BlogListingPage, {
  generateMetadata,
} from '~/app/[locale]/page';

vi.mock('~/i18n/routing', () => ({
  Link: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async () => (key: string) =>
    ({ title: 'Blog', description: 'Technical articles.' })[key],
}));

function makePost(slug: string, publishedAt: string): BlogPost {
  const localized = (prefix: string) => ({
    'en-US': `${prefix} ${slug}`,
    'pt-BR': `${prefix} ${slug}`,
    es: `${prefix} ${slug}`,
  });
  const result = BlogPost.create({
    slug,
    title: localized('Title'),
    description: localized('Description'),
    content: { 'en-US': '# Body', 'pt-BR': '# Corpo', es: '# Cuerpo' },
    tags: ['nextjs'],
    publishedAt,
  });
  if (result.isLeft()) throw result.value;
  return result.value;
}

const findAll = vi.fn();
const findBySlug = vi.fn();

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({
    blogPostRepository: { findAll: () => findAll(), findBySlug: () => findBySlug() },
  }),
}));

describe('BlogListingPage', () => {
  it('should render post cards when posts exist', async () => {
    findAll.mockResolvedValue([makePost('hello-blog', '2026-08-01')]);

    render(await BlogListingPage({ params: Promise.resolve({ locale: 'en-US' }) }));

    expect(screen.getByText('Title hello-blog')).toBeInTheDocument();
    expect(screen.getByText('Description hello-blog')).toBeInTheDocument();
    expect(screen.getByText('nextjs')).toBeInTheDocument();
  });

  it('should render an empty state when there are no posts', async () => {
    findAll.mockResolvedValue([]);

    render(await BlogListingPage({ params: Promise.resolve({ locale: 'en-US' }) }));

    expect(screen.getByText('No posts published yet.')).toBeInTheDocument();
  });

  it('should render an empty state when the repository throws', async () => {
    findAll.mockRejectedValue(new Error('fs error'));

    render(await BlogListingPage({ params: Promise.resolve({ locale: 'en-US' }) }));

    expect(screen.getByText('No posts published yet.')).toBeInTheDocument();
  });
});

describe('generateMetadata', () => {
  it('should return title and description from the Metadata namespace', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en-US' }),
    });

    expect(metadata.title).toBe('Blog');
    expect(metadata.description).toBeTruthy();
  });
});
