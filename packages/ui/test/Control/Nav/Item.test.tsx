import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef } from 'react';

import { NavItem } from '~/Control/Nav/Item';

describe('NavItem', () => {
  it('should render the href on the injected component when one is provided', () => {
    const RouterLink = (props: ComponentPropsWithoutRef<'a'>) => (
      <a data-testid="router-link" {...props} />
    );

    render(
      <NavItem component={RouterLink} href="/en-US/projects">
        Projects
      </NavItem>,
    );

    expect(screen.getByTestId('router-link')).toHaveAttribute(
      'href',
      '/en-US/projects',
    );
  });

  it('should call onNavigate when the link is clicked', async () => {
    const onNavigate = vi.fn();
    render(
      <NavItem href="/en-US" onNavigate={onNavigate}>
        Home
      </NavItem>,
    );

    await userEvent.click(screen.getByRole('link', { name: 'Home' }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('should set aria-current="page" only when active', () => {
    const { rerender } = render(<NavItem href="/en-US">Home</NavItem>);

    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');

    rerender(
      <NavItem href="/en-US" active>
        Home
      </NavItem>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('should render the external affordances only when external', () => {
    const { rerender } = render(<NavItem href="/en-US">Home</NavItem>);
    const link = screen.getByRole('link');

    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');

    rerender(
      <NavItem href="https://example.com/cv.pdf" external>
        Resume
      </NavItem>,
    );

    const externalLink = screen.getByRole('link');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
