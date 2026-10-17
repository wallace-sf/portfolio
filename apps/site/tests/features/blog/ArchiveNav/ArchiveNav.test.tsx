/**
 * @vitest-environment jsdom
 */
import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArchiveNav } from '~features/blog/ArchiveNav';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

const years = [
  { year: 2026, count: 8 },
  { year: 2025, count: 1 },
];

describe('ArchiveNav', () => {
  it('should link each year to its archive with its post count, newest first', async () => {
    await renderServerComponent(ArchiveNav({ years, locale: 'en-US' }));

    const nav = screen.getByRole('navigation', { name: 'Archive' });
    const links = within(nav)
      .getAllByRole('link')
      .map((link) => [link.textContent, link.getAttribute('href')]);

    expect(links).toEqual([
      ['2026 · 8 posts', '/en-US/blog/2026'],
      ['2025 · 1 post', '/en-US/blog/2025'],
    ]);
  });

  it('should localize the heading and the counts when the locale changes', async () => {
    await renderServerComponent(ArchiveNav({ years, locale: 'es' }), {
      locale: 'es',
    });

    expect(
      screen.getByRole('heading', { level: 2, name: 'Archivo' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^2025/ })).toHaveAttribute(
      'href',
      '/es/blog/2025',
    );
  });

  it('should render nothing when there are no years', async () => {
    const { container } = await renderServerComponent(
      ArchiveNav({ years: [], locale: 'en-US' }),
    );

    expect(container).toBeEmptyDOMElement();
  });
});
