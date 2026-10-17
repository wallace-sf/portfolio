/**
 * @vitest-environment jsdom
 */
import type { BlogPostSummaryDTO } from '@repo/application/blog';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FeaturedPosts } from '~features/blog/FeaturedPosts';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

const post = (slug: string, publishedAt: string): BlogPostSummaryDTO => ({
  slug,
  title: `Title ${slug}`,
  description: `Description ${slug}`,
  publishedAt,
  readingMinutes: 2,
  featured: true,
  tags: ['ddd'],
  author: { name: 'Test Author', avatarUrl: 'https://example.com/a.jpg' },
});

const posts = [
  post('newest-pick', '2026-10-17T00:00:00.000Z'),
  post('older-pick', '2026-08-08T00:00:00.000Z'),
];

describe('FeaturedPosts', () => {
  it('should render the picks as linked cards under a Featured heading, in order', async () => {
    await renderServerComponent(FeaturedPosts({ posts, locale: 'pt-BR' }), {
      locale: 'pt-BR',
    });

    const band = screen.getByRole('region', { name: 'Em destaque' });
    expect(
      within(band)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(['Title newest-pick', 'Title older-pick']);
    expect(within(band).getAllByRole('link')[0]).toHaveAttribute(
      'href',
      '/pt-BR/blog/2026/10/newest-pick',
    );
  });

  it('should render nothing when there are no featured posts', async () => {
    const { container } = await renderServerComponent(
      FeaturedPosts({ posts: [], locale: 'en-US' }),
    );

    expect(container).toBeEmptyDOMElement();
  });
});
