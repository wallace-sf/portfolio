import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BlogPost } from '@repo/core/blog';

import BlogPostPage, { generateMetadata } from '~/app/[locale]/[slug]/page';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <pre>{source}</pre>,
}));

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  notFound: () => notFound(),
}));

function makePost(slug: string): BlogPost {
  const localized = (prefix: string) => ({
    'en-US': `${prefix} ${slug}`,
    'pt-BR': `${prefix} ${slug}`,
    es: `${prefix} ${slug}`,
  });
  const result = BlogPost.create({
    slug,
    title: localized('Title'),
    description: localized('Description'),
    content: {
      'en-US': '# Body\n\nHello.',
      'pt-BR': '# Corpo\n\nOlá.',
      es: '# Cuerpo\n\nHola.',
    },
    tags: ['nextjs'],
    publishedAt: '2026-08-01',
  });
  if (result.isLeft()) throw result.value;
  return result.value;
}

const findBySlug = vi.fn();

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({
    blogPostRepository: {
      findAll: vi.fn(),
      findBySlug: () => findBySlug(),
    },
  }),
}));

describe('BlogPostPage', () => {
  it('should render title, description and content when the post exists', async () => {
    findBySlug.mockResolvedValue(makePost('hello-blog'));

    render(
      await BlogPostPage({
        params: Promise.resolve({ locale: 'en-US', slug: 'hello-blog' }),
      }),
    );

    expect(screen.getByText('Title hello-blog')).toBeInTheDocument();
    expect(screen.getByText('Description hello-blog')).toBeInTheDocument();
    expect(screen.getByText(/# Body/)).toBeInTheDocument();
  });

  it('should call notFound when the post does not exist', async () => {
    findBySlug.mockResolvedValue(null);

    await expect(
      BlogPostPage({
        params: Promise.resolve({ locale: 'en-US', slug: 'missing' }),
      }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});

describe('generateMetadata', () => {
  it('should return title/description/canonical for an existing post', async () => {
    findBySlug.mockResolvedValue(makePost('hello-blog'));

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en-US', slug: 'hello-blog' }),
    });

    expect(metadata.title).toBe('Title hello-blog');
    expect(metadata.description).toBe('Description hello-blog');
    expect(metadata.alternates?.canonical).toContain('/blog/en-US/hello-blog');
  });

  it('should return an empty object when the post does not exist', async () => {
    findBySlug.mockResolvedValue(null);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en-US', slug: 'missing' }),
    });

    expect(metadata).toEqual({});
  });
});
