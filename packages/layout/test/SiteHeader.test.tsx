import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SiteHeader } from '~/SiteHeader';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('@repo/ui/Control', () => ({
  Button: {
    Base: ({
      children,
      ...rest
    }: {
      children: ReactNode;
    } & ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button type="button" {...rest}>
        {children}
      </button>
    ),
  },
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid="icon" data-icon={icon} />
  ),
}));

const defaultProps = {
  locale: 'pt-BR' as const,
  isOpen: false,
  onToggle: vi.fn(),
};

describe('SiteHeader', () => {
  it('should link the logo to the portfolio home for the active locale when rendered', () => {
    render(<SiteHeader {...defaultProps} locale="es" />);

    expect(screen.getByRole('link', { name: 'logo_alt' })).toHaveAttribute(
      'href',
      '/es',
    );
  });

  it('should render the inlined brand logo inside the link when rendered', () => {
    render(<SiteHeader {...defaultProps} />);

    expect(
      screen.getByRole('link', { name: 'logo_alt' }).querySelector('svg'),
    ).toBeInTheDocument();
  });

  it('should call onToggle when the menu button is clicked', async () => {
    const onToggle = vi.fn();
    render(<SiteHeader {...defaultProps} onToggle={onToggle} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('should show the menu icon and open label when it is closed', () => {
    render(<SiteHeader {...defaultProps} isOpen={false} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'openMenu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('icon')).toHaveAttribute(
      'data-icon',
      'ic:round-menu',
    );
  });

  it('should show the close icon and close label when it is open', () => {
    render(<SiteHeader {...defaultProps} isOpen />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'closeMenu');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('icon')).toHaveAttribute(
      'data-icon',
      'ic:round-close',
    );
  });
});
