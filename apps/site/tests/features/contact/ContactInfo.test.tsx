/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) =>
    `${namespace}.${key}`,
  useLocale: () => 'en',
}));

vi.mock('@repo/ui/Control', () => ({
  Button: {
    Clipboard: ({
      children,
      'aria-label': ariaLabel,
    }: {
      children: React.ReactNode;
      'aria-label'?: string;
    }) => <button aria-label={ariaLabel}>{children}</button>,
  },
  Nav: {
    ShortLink: ({ 'aria-label': ariaLabel }: { 'aria-label'?: string }) => (
      <a aria-label={ariaLabel} />
    ),
  },
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}));

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

vi.mock('@repo/utils', () => ({
  formatCellphone: (v: string) => v,
}));

describe('ContactInfo', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should render clipboard buttons with accessible aria-label', async () => {
    const { ContactInfo } = await import('~features/contact/ContactInfo');
    render(React.createElement(ContactInfo));

    const buttons = screen.getAllByRole('button', {
      name: 'Clipboard.copy',
    });
    expect(buttons).toHaveLength(2);
  });

  it('should render the rss link when the blog nav flag is unset', async () => {
    vi.stubEnv('NEXT_PUBLIC_BLOG_NAV_ENABLED', undefined);
    const { ContactInfo } = await import('~features/contact/ContactInfo');
    render(React.createElement(ContactInfo));

    expect(screen.getByLabelText('ContactInfo.rss')).toBeInTheDocument();
  });

  it('should hide the rss link when the blog nav flag is "false"', async () => {
    vi.stubEnv('NEXT_PUBLIC_BLOG_NAV_ENABLED', 'false');
    const { ContactInfo } = await import('~features/contact/ContactInfo');
    render(React.createElement(ContactInfo));

    expect(screen.queryByLabelText('ContactInfo.rss')).not.toBeInTheDocument();
  });
});
