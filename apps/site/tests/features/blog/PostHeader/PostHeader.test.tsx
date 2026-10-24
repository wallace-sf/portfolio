/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PostHeader } from '~features/blog/PostHeader';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('@repo/ui/Imagery', () => ({
  Icon: () => <span data-testid="icon" />,
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const BASE = {
  title: 'The Either Pattern',
  description: 'Why this codebase never throws for domain errors.',
  publishedAt: '2026-08-01',
  readingMinutes: 4,
  author: {
    name: 'Test Author',
    avatarUrl: 'https://example.com/avatar.png',
  },
  tags: ['typescript', 'ddd'],
  locale: 'en-US',
};

describe('PostHeader', () => {
  it('should render a labelled published date and reading time', async () => {
    await renderServerComponent(PostHeader(BASE));

    expect(screen.getByText('Published on August 1, 2026')).toBeInTheDocument();
    expect(screen.getByText('4 min read')).toBeInTheDocument();
  });

  it('should present the author with their avatar', async () => {
    const { container } = await renderServerComponent(PostHeader(BASE));

    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      'https://example.com/avatar.png',
    );
    expect(screen.queryByText(/^By /)).not.toBeInTheDocument();
  });

  it('should link each tag to its tag page when the post has tags', async () => {
    await renderServerComponent(PostHeader(BASE), { locale: 'en-US' });

    expect(screen.getByRole('link', { name: 'typescript' })).toHaveAttribute(
      'href',
      '/en-US/blog/tags/typescript',
    );
    expect(screen.getByRole('link', { name: 'ddd' })).toHaveAttribute(
      'href',
      '/en-US/blog/tags/ddd',
    );
  });

  it('should label the tag list for screen readers when the post has tags', async () => {
    await renderServerComponent(PostHeader({ ...BASE, locale: 'es' }), {
      locale: 'es',
    });

    const list = screen.getByRole('list', { name: 'Etiquetas' });
    expect(list.querySelectorAll('li')).toHaveLength(2);
  });

  it('should not render a tag row when there are no tags', async () => {
    await renderServerComponent(PostHeader({ ...BASE, tags: [] }));

    expect(screen.queryByText('typescript')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
