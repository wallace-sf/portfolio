/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { BlogPostSummaryDTO } from '@repo/application/blog';

import { PostCard } from '~features/blog/PostCard';

import { renderWithIntl as render } from '../../../helpers/renderServerComponent';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const BASE: BlogPostSummaryDTO = {
  slug: 'the-either-pattern',
  title: 'The Either Pattern',
  description: 'Why this codebase never throws for domain errors.',
  publishedAt: '2026-08-01',
  featured: false,
  tags: ['typescript', 'ddd'],
  author: {
    name: 'Test Author',
    avatarUrl: 'https://example.com/avatar.jpg',
    url: 'https://example.com',
  },
};

describe('PostCard', () => {
  it('should link the whole card to the dated, locale-prefixed post URL', () => {
    render(<PostCard post={BASE} locale="pt-BR" />, { locale: 'pt-BR' });

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/pt-BR/blog/2026/08/the-either-pattern',
    );
  });

  it('should render the title, description and one badge per tag', () => {
    render(<PostCard post={BASE} locale="en-US" />);

    expect(
      screen.getByRole('heading', { name: 'The Either Pattern' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Why this codebase never throws for domain errors.'),
    ).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
    expect(screen.getByText('ddd')).toBeInTheDocument();
  });

  it('should render the published date as a machine-readable time formatted for the locale', () => {
    const { container } = render(<PostCard post={BASE} locale="es" />);
    const time = container.querySelector('time');

    expect(time).toHaveAttribute('datetime', '2026-08-01');
    expect(time?.textContent).toBe(
      new Intl.DateTimeFormat('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(new Date('2026-08-01')),
    );
  });

  it('should render the thumbnail only when the post has one', () => {
    const { rerender } = render(<PostCard post={BASE} locale="en-US" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    rerender(
      <PostCard
        post={{
          ...BASE,
          thumbnailImage: { url: 'https://cdn/t.webp', alt: 'Cover art' },
        }}
        locale="en-US"
      />,
    );
    expect(screen.getByRole('img', { name: 'Cover art' })).toHaveAttribute(
      'src',
      'https://cdn/t.webp',
    );
  });

  it('should not render a tag row when the post has no tags', () => {
    render(<PostCard post={{ ...BASE, tags: [] }} locale="en-US" />);

    expect(screen.queryByText('typescript')).not.toBeInTheDocument();
  });

  it('should render the title at the requested heading level when nested under a section', () => {
    render(<PostCard post={BASE} locale="en-US" headingLevel="h3" />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'The Either Pattern' }),
    ).toBeInTheDocument();
  });
});
