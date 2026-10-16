/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PostMeta } from '~features/blog/PostMeta';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

const BASE = {
  publishedAt: '2026-08-01T12:00:00.000Z',
  readingMinutes: 6,
  locale: 'en-US',
};

describe('PostMeta', () => {
  it('should render the reading time localized when given the minutes', async () => {
    await renderServerComponent(PostMeta({ ...BASE, locale: 'pt-BR' }));

    expect(screen.getByText('6 min de leitura')).toBeInTheDocument();
  });

  it('should render the published date as a locale-formatted time element', async () => {
    const { container } = await renderServerComponent(
      PostMeta({ ...BASE, locale: 'es' }),
    );
    const time = container.querySelector('time');

    expect(time).toHaveAttribute('datetime', BASE.publishedAt);
    expect(time).toHaveTextContent('1 de agosto de 2026');
  });

  it('should show the updated date when the post was updated on a later day', async () => {
    await renderServerComponent(
      PostMeta({ ...BASE, updatedAt: '2026-09-03T08:00:00.000Z' }),
    );

    expect(screen.getByText('Updated September 3, 2026')).toBeInTheDocument();
  });

  it('should hide the updated date when the post was updated on its publication day', async () => {
    await renderServerComponent(
      PostMeta({ ...BASE, updatedAt: '2026-08-01T23:00:00.000Z' }),
    );

    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
  });

  it('should credit the author when given an author name', async () => {
    await renderServerComponent(
      PostMeta({ ...BASE, authorName: 'Wallace Silva', locale: 'pt-BR' }),
    );

    expect(screen.getByText('Por Wallace Silva')).toBeInTheDocument();
  });

  it('should not credit anyone when no author name is given', async () => {
    await renderServerComponent(PostMeta(BASE));

    expect(screen.queryByText(/^By /)).not.toBeInTheDocument();
  });
});
