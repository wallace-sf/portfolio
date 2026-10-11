/**
 * @vitest-environment jsdom
 */
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PrevNextNav } from '~features/blog/PrevNextNav';

import { renderServerComponent } from '../../../helpers/renderServerComponent';

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) =>
    ({
      newerPost: 'Newer post',
      olderPost: 'Older post',
      postNavigation: 'Post navigation',
    })[key],
}));

const NEWER = {
  slug: 'newest-post',
  title: 'The Newest Post',
  publishedAt: '2026-08-22',
};
const OLDER = {
  slug: 'oldest-post',
  title: 'The Oldest Post',
  publishedAt: '2026-08-08',
};

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

    const nav = screen.getByRole('navigation', { name: 'Post navigation' });
    expect(nav).toBeInTheDocument();

    expect(screen.getByText('The Newest Post').closest('a')).toHaveAttribute(
      'href',
      '/es/blog/2026/08/newest-post',
    );
    expect(screen.getByText('The Oldest Post').closest('a')).toHaveAttribute(
      'href',
      '/es/blog/2026/08/oldest-post',
    );
    expect(screen.getByText('Newer post')).toBeInTheDocument();
    expect(screen.getByText('Older post')).toBeInTheDocument();
  });

  it('should render only the older link when there is no newer post', async () => {
    await renderServerComponent(PrevNextNav({ older: OLDER, locale: 'en-US' }));

    expect(screen.getByText('The Oldest Post')).toBeInTheDocument();
    expect(screen.queryByText('Newer post')).not.toBeInTheDocument();
  });
});
