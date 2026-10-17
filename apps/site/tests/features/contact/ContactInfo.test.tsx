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
  it('should render clipboard buttons with accessible aria-label', async () => {
    const { ContactInfo } = await import('~features/contact/ContactInfo');
    render(React.createElement(ContactInfo));

    const buttons = screen.getAllByRole('button', {
      name: 'Clipboard.copy',
    });
    expect(buttons).toHaveLength(2);
  });
});
