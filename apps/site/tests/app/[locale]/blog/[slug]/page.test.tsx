import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BlogPost } from '@repo/core/blog';

import BlogPostPage, {
  generateMetadata,
} from '~/app/[locale]/blog/[slug]/page';

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

// PrevNextNav is an async Server Component — render it synchronously here and
// cover its own behaviour in its dedicated test.
vi.mock('~features/blog/PrevNextNav', () => ({
  PrevNextNav: ({
    newer,
    older,
  }: {
    newer?: { slug: string; title: string };
    older?: { slug: string; title: string };
  }) => (
    <nav aria-label="Post navigation">
      {newer && <a href={`/blog/${newer.slug}`}>{newer.title}</a>}
      {older && <a href={`/blog/${older.slug}`}>{older.title}</a>}
    </nav>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

vi.mock('~/i18n/routing', async (importOriginal) => ({
  ...(await importOriginal<object>()),
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

const notFound = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  notFound: () => notFound(),
}));

function makePost(slug: string, publishedAt = '2026-08-01') {
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
      'en-US': 'Body of the post.',
      'pt-BR': 'Corpo do post.',
      es: 'Cuerpo del post.',
    },
    tags: ['nextjs'],
    publishedAt,
  });
  if (result.isLeft()) throw result.value;
  return result.value;
}

const findBySlug = vi.fn();
const findAll = vi.fn();

vi.mock('~/lib/server/container', () => ({
  getServerContainer: () => ({
    blogPostRepository: {
      findAll: () => findAll(),
      findBySlug: () => findBySlug(),
    },
  }),
}));

async function renderPage(slug: string, locale = 'en-US') {
  return render(
    await BlogPostPage({ params: Promise.resolve({ locale, slug }) }),
  );
}

describe('BlogPostPage', () => {
  it('should render the header, MDX content and (no) navigation for a lone post', async () => {
    findBySlug.mockResolvedValue(makePost('hello-blog'));
    findAll.mockResolvedValue([makePost('hello-blog')]);

    await renderPage('hello-blog');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Title hello-blog' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Description hello-blog')).toBeInTheDocument();
    expect(screen.getByText('Body of the post.')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should render newer and older links for a post in the middle of the list', async () => {
    findBySlug.mockResolvedValue(makePost('middle', '2026-08-15'));
    findAll.mockResolvedValue([
      makePost('newest', '2026-08-22'),
      makePost('middle', '2026-08-15'),
      makePost('oldest', '2026-08-08'),
    ]);

    await renderPage('middle');

    const nav = screen.getByRole('navigation', { name: 'Post navigation' });
    expect(nav).toContainElement(screen.getByText('Title newest'));
    expect(nav).toContainElement(screen.getByText('Title oldest'));
    expect(screen.getByText('Title newest').closest('a')).toHaveAttribute(
      'href',
      '/blog/newest',
    );
  });

  it('should render the cover hero only when the post has a cover image', async () => {
    findBySlug.mockResolvedValue(
      (() => {
        const r = BlogPost.create({
          slug: 'with-cover',
          title: { 'en-US': 'T', 'pt-BR': 'T', es: 'T' },
          description: { 'en-US': 'D', 'pt-BR': 'D', es: 'D' },
          content: { 'en-US': 'B', 'pt-BR': 'B', es: 'B' },
          tags: [],
          publishedAt: '2026-08-01',
          coverImage: {
            url: 'https://cdn/cover.webp',
            alt: { 'en-US': 'Cover', 'pt-BR': 'Capa', es: 'Portada' },
          },
        });
        if (r.isLeft()) throw r.value;
        return r.value;
      })(),
    );
    findAll.mockResolvedValue([]);

    await renderPage('with-cover');

    expect(screen.getByRole('img', { name: 'Cover' })).toHaveAttribute(
      'src',
      'https://cdn/cover.webp',
    );
  });

  it('should call notFound when the post does not exist', async () => {
    findBySlug.mockResolvedValue(null);
    findAll.mockResolvedValue([]);

    await expect(renderPage('missing')).rejects.toThrow('NEXT_NOT_FOUND');
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
    expect(metadata.alternates?.canonical).toContain('/en-US/blog/hello-blog');
  });

  it('should return an empty object when the post does not exist', async () => {
    findBySlug.mockResolvedValue(null);

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'en-US', slug: 'missing' }),
    });

    expect(metadata).toEqual({});
  });
});
