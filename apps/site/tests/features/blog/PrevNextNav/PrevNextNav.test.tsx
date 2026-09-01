/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PrevNextNav } from '~features/blog/PrevNextNav';

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) =>
    ({
      newerPost: 'Newer post',
      olderPost: 'Older post',
      postNavigation: 'Post navigation',
    })[key],
}));

vi.mock('~/i18n/routing', () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const NEWER = { slug: 'newest-post', title: 'The Newest Post' };
const OLDER = { slug: 'oldest-post', title: 'The Oldest Post' };

describe('PrevNextNav', () => {
  it('should render nothing when there is neither a newer nor an older post', async () => {
    const { container } = render(await PrevNextNav({ locale: 'en-US' }));

    expect(container).toBeEmptyDOMElement();
  });

  it('should link to the newer and older posts with locale-aware hrefs', async () => {
    render(await PrevNextNav({ newer: NEWER, older: OLDER, locale: 'en-US' }));

    const nav = screen.getByRole('navigation', { name: 'Post navigation' });
    expect(nav).toBeInTheDocument();

    expect(screen.getByText('The Newest Post').closest('a')).toHaveAttribute(
      'href',
      '/blog/newest-post',
    );
    expect(screen.getByText('The Oldest Post').closest('a')).toHaveAttribute(
      'href',
      '/blog/oldest-post',
    );
    expect(screen.getByText('Newer post')).toBeInTheDocument();
    expect(screen.getByText('Older post')).toBeInTheDocument();
  });

  it('should render only the older link when there is no newer post', async () => {
    render(await PrevNextNav({ older: OLDER, locale: 'en-US' }));

    expect(screen.getByText('The Oldest Post')).toBeInTheDocument();
    expect(screen.queryByText('Newer post')).not.toBeInTheDocument();
  });
});
