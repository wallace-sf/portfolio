/**
 * @vitest-environment jsdom
 */
import type { BlogPostSummaryDTO } from '@repo/application/blog';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PostCard } from '~features/blog/PostCard';

import { buildBlogPostSummaryDTO } from '../../../helpers/dtos/blogPostSummary';
import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    sizes,
  }: {
    src: string;
    alt: string;
    sizes: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} sizes={sizes} />
  ),
}));

const BASE = buildBlogPostSummaryDTO({
  slug: 'the-either-pattern',
  title: 'The Either Pattern',
  description: 'Why this codebase never throws for domain errors.',
  publishedAt: '2026-08-01',
  tags: ['typescript', 'ddd'],
});

const WITH_THUMBNAIL: BlogPostSummaryDTO = {
  ...BASE,
  thumbnailImage: { url: 'https://cdn/t.webp', alt: 'Cover art' },
};

describe('PostCard', () => {
  it('should link the whole card to the dated, locale-prefixed post URL', async () => {
    await renderServerComponent(<PostCard post={BASE} locale="pt-BR" />, {
      locale: 'pt-BR',
    });

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/pt-BR/blog/2026/08/the-either-pattern',
    );
  });

  it('should render the title, description and one badge per tag', async () => {
    await renderServerComponent(<PostCard post={BASE} locale="en-US" />);

    expect(
      screen.getByRole('heading', { name: 'The Either Pattern' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Why this codebase never throws for domain errors.'),
    ).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('ddd')).toBeInTheDocument();
  });

  it('should render the reading time next to the date when the card renders', async () => {
    await renderServerComponent(<PostCard post={BASE} locale="pt-BR" />, {
      locale: 'pt-BR',
    });

    expect(screen.getByText('3 min de leitura')).toBeInTheDocument();
  });

  it('should not render a thumbnail when the post has none', async () => {
    await renderServerComponent(<PostCard post={BASE} locale="en-US" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render the thumbnail when the post has one', async () => {
    const thumbnailImage = { url: 'https://cdn/t.webp', alt: 'Cover art' };

    await renderServerComponent(
      <PostCard post={{ ...BASE, thumbnailImage }} locale="en-US" />,
    );

    expect(screen.getByRole('img', { name: 'Cover art' })).toHaveAttribute(
      'src',
      'https://cdn/t.webp',
    );
  });

  it('should not render a tag row when the post has no tags', async () => {
    await renderServerComponent(
      <PostCard post={{ ...BASE, tags: [] }} locale="en-US" />,
    );

    expect(screen.queryByText('typescript')).not.toBeInTheDocument();
  });

  it('should render the title at the requested heading level when nested under a section', async () => {
    await renderServerComponent(
      <PostCard post={BASE} locale="en-US" headingLevel="h3" />,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'The Either Pattern' }),
    ).toBeInTheDocument();
  });

  it('should size the thumbnail for a narrow column when the layout is stacked', async () => {
    const { unmount } = await renderServerComponent(
      <PostCard post={WITH_THUMBNAIL} locale="en-US" />,
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'sizes',
      '(min-width: 640px) 14rem, calc(100vw - 2rem)',
    );
    unmount();

    await renderServerComponent(
      <PostCard post={WITH_THUMBNAIL} locale="en-US" layout="stacked" />,
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'sizes',
      '(min-width: 768px) 24rem, calc(100vw - 2rem)',
    );
  });
});
