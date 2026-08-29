import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { SideNavigation } from '~/components/Layout/SideNavigation';

vi.mock('@repo/layout/SideNav', () => ({
  SideNav: ({
    locale,
    primary,
    secondary,
  }: {
    locale: string;
    primary: ReactNode;
    secondary: ReactNode;
  }) => (
    <nav data-testid="side-nav" data-locale={locale}>
      {primary}
      {secondary}
    </nav>
  ),
}));

describe('SideNavigation', () => {
  it('should render the shared SideNav shell with the active locale', () => {
    render(<SideNavigation locale="pt-BR" />);
    expect(screen.getByTestId('side-nav')).toHaveAttribute(
      'data-locale',
      'pt-BR',
    );
  });
});
