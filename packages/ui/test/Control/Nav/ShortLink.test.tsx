import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef } from 'react';

import { NavShortLink } from '~/Control/Nav/ShortLink';

describe('NavShortLink', () => {
  it('should expose its aria-label as the accessible name', () => {
    render(
      <NavShortLink
        href="https://github.com/x"
        icon="mdi:github"
        aria-label="GitHub"
      />,
    );

    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
  });

  it('should render the href on the injected component', () => {
    const RouterLink = (props: ComponentPropsWithoutRef<'a'>) => (
      <a data-testid="router-link" {...props} />
    );

    render(
      <NavShortLink
        component={RouterLink}
        href="/en-US/feed.xml"
        icon="mdi:rss"
        aria-label="RSS"
      />,
    );

    expect(screen.getByTestId('router-link')).toHaveAttribute(
      'href',
      '/en-US/feed.xml',
    );
  });

  it('should call onNavigate when clicked', async () => {
    const onNavigate = vi.fn();
    render(
      <NavShortLink
        href="/x"
        icon="mdi:rss"
        aria-label="RSS"
        onNavigate={onNavigate}
      />,
    );

    await userEvent.click(screen.getByRole('link', { name: 'RSS' }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('should render target/rel only when external', () => {
    const { rerender } = render(
      <NavShortLink href="/x" icon="mdi:rss" aria-label="RSS" />,
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('target');

    rerender(
      <NavShortLink
        href="https://wa.me/1"
        icon="logos:whatsapp-icon"
        aria-label="WhatsApp"
        external
      />,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
