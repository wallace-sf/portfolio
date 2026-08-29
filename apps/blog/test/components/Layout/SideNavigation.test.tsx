import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SideNavigation } from '~/components/Layout/SideNavigation';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@repo/layout/SiteHeader', () => ({
  SiteHeader: ({
    locale,
    isOpen,
    onToggle,
  }: {
    locale: string;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      data-locale={locale}
      data-open={isOpen}
      onClick={onToggle}
    >
      header
    </button>
  ),
}));

describe('SideNavigation', () => {
  it('should render the shared SiteHeader with the locale and drawer state', () => {
    render(<SideNavigation locale="es" isOpen onToggle={vi.fn()} />);

    const header = screen.getByRole('button', { name: 'header' });
    expect(header).toHaveAttribute('data-locale', 'es');
    expect(header).toHaveAttribute('data-open', 'true');
  });

  it('should expose the nav landmark with its accessible label', () => {
    render(<SideNavigation locale="en-US" isOpen={false} onToggle={vi.fn()} />);

    expect(
      screen.getByRole('navigation', { name: 'mainNav' }),
    ).toBeInTheDocument();
  });

  it('should forward the header toggle to onToggle', async () => {
    const onToggle = vi.fn();
    render(
      <SideNavigation locale="en-US" isOpen={false} onToggle={onToggle} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'header' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should translate the drawer offscreen when closed and onscreen when open', () => {
    const { rerender } = render(
      <SideNavigation locale="en-US" isOpen={false} onToggle={vi.fn()} />,
    );
    expect(screen.getByRole('navigation')).toHaveClass('translate-x-full');

    rerender(<SideNavigation locale="en-US" isOpen onToggle={vi.fn()} />);
    expect(screen.getByRole('navigation')).toHaveClass('translate-x-0');
  });
});
