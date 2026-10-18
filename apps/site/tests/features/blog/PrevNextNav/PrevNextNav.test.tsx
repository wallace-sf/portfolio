/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PrevNextNav } from '~features/blog/PrevNextNav';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock(
  'next-intl/server',
  async () => (await import('../../../helpers/intlServerMock')).intlServerMock,
);

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}));

const NEWER = {
  slug: 'newest-post',
  title: 'The Newest Post',
  publishedAt: '2026-08-22T12:00:00.000Z',
};
const OLDER = {
  slug: 'oldest-post',
  title: 'The Oldest Post',
  publishedAt: '2026-08-08T12:00:00.000Z',
};

const linkTo = (title: string) =>
  screen.getByText(title).closest('a') as HTMLElement;

describe('PrevNextNav', () => {
  it('should render nothing when there is neither a newer nor an older post', async () => {
    const { container } = await renderServerComponent(
      PrevNextNav({ locale: 'en-US' }),
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('should link to the newer and older posts with dated, locale-prefixed hrefs', async () => {
    await renderServerComponent(
      PrevNextNav({ newer: NEWER, older: OLDER, locale: 'es' }),
      { locale: 'es' },
    );

    expect(
      screen.getByRole('navigation', { name: 'Navegación de publicaciones' }),
    ).toBeInTheDocument();
    expect(linkTo('The Newest Post')).toHaveAttribute(
      'href',
      '/es/blog/2026/08/newest-post',
    );
    expect(linkTo('The Oldest Post')).toHaveAttribute(
      'href',
      '/es/blog/2026/08/oldest-post',
    );
  });

  it('should mark the newer link rel="prev" and the older one rel="next"', async () => {
    await renderServerComponent(
      PrevNextNav({ newer: NEWER, older: OLDER, locale: 'en-US' }),
    );

    expect(linkTo('The Newest Post')).toHaveAttribute('rel', 'prev');
    expect(linkTo('The Oldest Post')).toHaveAttribute('rel', 'next');
  });

  it('should show each target date as a <time> formatted in the page locale', async () => {
    await renderServerComponent(
      PrevNextNav({ newer: NEWER, older: OLDER, locale: 'pt-BR' }),
      { locale: 'pt-BR' },
    );

    const newerTime = linkTo('The Newest Post').querySelector('time');
    expect(newerTime).toHaveAttribute('dateTime', '2026-08-22T12:00:00.000Z');
    expect(newerTime).toHaveTextContent('22 de agosto de 2026');
    expect(linkTo('The Oldest Post').querySelector('time')).toHaveTextContent(
      '8 de agosto de 2026',
    );
  });

  it('should point each link with its direction arrow and label', async () => {
    await renderServerComponent(
      PrevNextNav({ newer: NEWER, older: OLDER, locale: 'en-US' }),
    );

    const newer = linkTo('The Newest Post');
    const older = linkTo('The Oldest Post');
    expect(newer).toHaveTextContent('Newer');
    expect(
      newer.querySelector('[data-icon="material-symbols:arrow-back"]'),
    ).not.toBeNull();
    expect(older).toHaveTextContent('Older');
    expect(
      older.querySelector('[data-icon="material-symbols:arrow-forward"]'),
    ).not.toBeNull();
  });

  it('should keep a lone older link in the right column without spacer elements', async () => {
    await renderServerComponent(PrevNextNav({ older: OLDER, locale: 'en-US' }));

    const nav = screen.getByRole('navigation');
    expect(nav.children).toHaveLength(1);
    expect(linkTo('The Oldest Post')).toHaveClass('sm:col-start-2');
    expect(screen.queryByText('Newer')).not.toBeInTheDocument();
  });
});
