import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ShareButton } from '~features/shared/ShareButton';

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'es',
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid={`icon-${icon}`} />,
}));

vi.mock('@repo/ui/Control', () => ({
  Button: {
    Clipboard: ({
      text,
      tooltip,
      'aria-label': label,
    }: {
      text: string;
      tooltip: string;
      'aria-label': string;
    }) => <button aria-label={label} data-text={text} title={tooltip} />,
  },
}));

describe('ShareButton', () => {
  it('should copy the absolute url of the path in the current locale when clicked', () => {
    render(<ShareButton path="/blog/2026/10/post" label="Copy post link" />);

    const button = screen.getByRole('button', { name: 'Copy post link' });
    expect(button).toHaveAttribute(
      'data-text',
      `${window.location.origin}/es/blog/2026/10/post`,
    );
    expect(button).toHaveAttribute('title', 'Share.copyLink');
  });
});
