import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('~i18n/routing', () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import NotFound from '~/app/[locale]/not-found';

describe('NotFound', () => {
  it('should render the 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render translated title and description', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('should render a link back to home', () => {
    render(<NotFound />);
    const link = screen.getByRole('link', { name: 'backToHome' });
    expect(link).toHaveAttribute('href', '/');
  });
});
