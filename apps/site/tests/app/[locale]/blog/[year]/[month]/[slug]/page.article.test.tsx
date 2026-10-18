import type { IBlogPostRepository } from '@repo/application/blog';
import type { BlogPost } from '@repo/core/blog';
import { BlogPostBuilder } from '@repo/core/testing';
import { act, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BlogPostPage from '~/app/[locale]/blog/[year]/[month]/[slug]/page';
import { env } from '~/config/env';

import { renderServerComponent } from '../../../../../../helpers/renderServerComponent';

// The article-level parts of the post page: author block and `BlogPosting`
// JSON-LD. Only true boundaries are mocked, as in `page.test.tsx`.

vi.mock(
  'next-intl/server',
  async () =>
    (await import('../../../../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
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

const AUTHOR = {
  name: 'Test Author',
  avatarUrl: 'https://example.com/avatar.png',
  url: 'https://example.com',
};

const BODY_WITH_SECTIONS = [
  '## Why Either?',
  'Text.',
  '### The `Left` side',
  'Text.',
  '## Usage',
  'Text.',
].join('\n\n');

async function renderPost(
  locale: string,
  content = 'A short body.',
  others: BlogPost[] = [],
) {
  posts = [
    BlogPostBuilder.published('hello-blog', '2026-09-02T10:00:00.000Z')
      .withAuthor(AUTHOR)
      .withTags(['typescript', 'ddd'])
      .withContent({ 'en-US': content, 'pt-BR': content, es: content })
      .now(),
    ...others,
  ];
  const params = { locale, year: '2026', month: '09', slug: 'hello-blog' };

  return renderServerComponent(
    BlogPostPage({ params: Promise.resolve(params) }),
    { locale },
  );
}

const jsonLdOfType = (container: HTMLElement, type: string) =>
  [...container.querySelectorAll('script[type="application/ld+json"]')]
    .map((script) => JSON.parse(script.textContent ?? '{}'))
    .find((node) => node['@type'] === type);

beforeEach(() => {
  posts = [];
});

describe('BlogPostPage article', () => {
  it('should render the author block after the body when the post is shown', async () => {
    await renderPost('pt-BR');

    const byline = screen.getByRole('region', { name: 'Sobre o autor' });
    expect(
      within(byline).getByRole('link', { name: 'Test Author' }),
    ).toHaveAttribute('href', 'https://example.com');
  });

  it('should emit BlogPosting JSON-LD for the post at its dated URL', async () => {
    const { container } = await renderPost('pt-BR');
    const url = `${env.siteUrl}/pt-BR/blog/2026/09/hello-blog`;

    expect(jsonLdOfType(container, 'BlogPosting')).toMatchObject({
      '@context': 'https://schema.org',
      url,
      headline: 'Title hello-blog (pt)',
      datePublished: '2026-09-02T10:00:00.000Z',
      author: { name: 'Test Author' },
      keywords: 'typescript, ddd',
      inLanguage: 'pt-BR',
      image: `${url}/opengraph-image`,
    });
  });

  it('should link every table-of-contents entry to a heading in the body', async () => {
    const { container } = await renderPost('en-US', BODY_WITH_SECTIONS);

    // Two placements: the inline block (below xl) and the xl rail.
    const tocs = screen.getAllByRole('navigation', { name: 'On this page' });
    const targetsOf = (toc: HTMLElement) =>
      within(toc)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href')?.slice(1));

    expect(tocs).toHaveLength(2);
    tocs.forEach((toc) =>
      expect(targetsOf(toc)).toEqual(['why-either', 'the-left-side', 'usage']),
    );
    ['why-either', 'the-left-side', 'usage'].forEach((id) =>
      expect(
        container.querySelector(`.markdown-body [id="${id}"]`),
      ).not.toBeNull(),
    );
  });

  it('should fill the reading progress bar once the post body is read', async () => {
    vi.stubGlobal('requestAnimationFrame', (update: FrameRequestCallback) => {
      update(0);
      return 0;
    });
    const { container } = await renderPost('en-US');
    const body = container.querySelector('.markdown-body')
      ?.parentElement as HTMLElement;
    const bar = container.querySelector<HTMLElement>(
      '[aria-hidden="true"][style*="scaleX"]',
    );

    body.getBoundingClientRect = () =>
      ({ top: -5000, height: 2000 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(body.id).not.toBe('');
    expect(bar?.style.transform).toBe('scaleX(1)');
    vi.unstubAllGlobals();
  });

  it('should list related posts between the author block and prev/next', async () => {
    await renderPost('en-US', 'Body.', [
      BlogPostBuilder.published('shares-a-tag', '2026-08-01T10:00:00.000Z')
        .withTags(['ddd'])
        .now(),
    ]);

    const related = screen.getByRole('region', { name: 'Further reading' });
    expect(
      within(related).getByRole('link', { name: 'Title shares-a-tag' }),
    ).toHaveAttribute('href', '/en-US/blog/2026/08/shares-a-tag');

    const byline = screen.getByRole('region', { name: 'About the author' });
    const prevNext = screen.getByRole('navigation', {
      name: 'Post navigation',
    });
    const follows = (a: Node, b: Node) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(follows(byline, related)).toBe(true);
    expect(follows(related, prevNext)).toBe(true);
  });

  it('should not render related posts when no other post shares a tag', async () => {
    await renderPost('en-US', 'Body.', [
      BlogPostBuilder.published('unrelated', '2026-08-01T10:00:00.000Z')
        .withTags(['seo'])
        .now(),
    ]);

    expect(
      screen.queryByRole('region', { name: 'Further reading' }),
    ).not.toBeInTheDocument();
  });

  it('should not render a table of contents when the post has few headings', async () => {
    await renderPost('en-US');

    expect(
      screen.queryByRole('navigation', { name: 'On this page' }),
    ).not.toBeInTheDocument();
  });
});
