import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef } from 'react';

import { NavLink } from '~/Control/Nav/Link';

describe('NavLink', () => {
  it('should render the href on the injected component', () => {
    const RouterLink = (props: ComponentPropsWithoutRef<'a'>) => (
      <a data-testid="router-link" {...props} />
    );

    render(
      <NavLink component={RouterLink} href="/en-US/feed.xml" icon="mdi:rss">
        RSS
      </NavLink>,
    );

    expect(screen.getByTestId('router-link')).toHaveAttribute(
      'href',
      '/en-US/feed.xml',
    );
  });

  it('should call onNavigate when clicked', async () => {
    const onNavigate = vi.fn();
    render(
      <NavLink href="/en-US/feed.xml" onNavigate={onNavigate}>
        RSS
      </NavLink>,
    );

    await userEvent.click(screen.getByRole('link', { name: /RSS/ }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('should render target/rel only when external', () => {
    const { rerender } = render(<NavLink href="/internal">Internal</NavLink>);
    expect(screen.getByRole('link')).not.toHaveAttribute('target');

    rerender(
      <NavLink href="https://github.com/x" external>
        GitHub
      </NavLink>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
