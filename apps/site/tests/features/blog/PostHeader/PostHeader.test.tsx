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

const BASE = {
  title: 'The Either Pattern',
  description: 'Why this codebase never throws for domain errors.',
  publishedAt: '2026-08-01',
  readingMinutes: 4,
  authorName: 'Test Author',
  tags: ['typescript', 'ddd'],
  locale: 'en-US',
};

describe('PostHeader', () => {
  it('should render the metadata line with the author and reading time', async () => {
    await renderServerComponent(PostHeader(BASE));

    expect(screen.getByText('By Test Author')).toBeInTheDocument();
    expect(screen.getByText('4 min read')).toBeInTheDocument();
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
