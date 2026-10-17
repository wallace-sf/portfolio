/**
 * @vitest-environment jsdom
 */
import type { BlogPostSummaryDTO } from '@repo/application/blog';
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RelatedPosts } from '~features/blog/RelatedPosts';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

const post = (
  slug: string,
  publishedAt: string,
  readingMinutes = 4,
): BlogPostSummaryDTO => ({
  slug,
  title: `Title ${slug}`,
  description: `Description ${slug}`,
  publishedAt,
  readingMinutes,
  featured: false,
  tags: ['ddd'],
  author: { name: 'Test Author', avatarUrl: 'https://example.com/a.jpg' },
});

const posts = [
  post('most-related', '2026-10-12T12:00:00.000Z', 7),
  post('less-related', '2026-09-02T12:00:00.000Z'),
];

describe('RelatedPosts', () => {
  it('should render nothing when there are no related posts', async () => {
    const { container } = await renderServerComponent(
      RelatedPosts({ posts: [], locale: 'en-US' }),
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should list the posts in order under a Further reading heading', async () => {
    await renderServerComponent(RelatedPosts({ posts, locale: 'en-US' }));

    const section = screen.getByRole('region', { name: 'Further reading' });
    const links = within(section).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/en-US/blog/2026/10/most-related',
      '/en-US/blog/2026/09/less-related',
    ]);
    expect(links[0]).toHaveTextContent('Title most-related');
  });

  it('should show each post date and reading time in the page locale', async () => {
    await renderServerComponent(RelatedPosts({ posts, locale: 'pt-BR' }), {
      locale: 'pt-BR',
    });

    const section = screen.getByRole('region', { name: 'Leia também' });
    const [first] = within(section).getAllByRole('listitem');

    expect(first?.querySelector('time')).toHaveAttribute(
      'dateTime',
      '2026-10-12T12:00:00.000Z',
    );
    expect(first).toHaveTextContent('7 min de leitura');
  });
});
