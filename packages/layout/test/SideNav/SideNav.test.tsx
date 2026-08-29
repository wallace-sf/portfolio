import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SideNav } from '~/SideNav';
import { useSideNav } from '~/SideNav/context';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('~/SiteHeader', () => ({
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

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

vi.mock('usehooks-ts', async () => {
  const { useState } = await import('react');
  return {
    useBoolean: (initial: boolean) => {
      const [value, setValue] = useState(initial);
      return {
        value,
        setTrue: () => setValue(true),
        setFalse: () => setValue(false),
        toggle: () => setValue((v) => !v),
      };
    },
    useMediaQuery: () => false,
    useScrollLock: vi.fn(),
  };
});

const CloseButton = () => {
  const { closeMenu } = useSideNav();
  return (
    <button type="button" onClick={closeMenu}>
      close
    </button>
  );
};

const renderSideNav = (primary = <li>primary item</li>) =>
  render(
    <SideNav
      locale="en-US"
      primary={primary}
      secondary={<li>secondary item</li>}
    />,
  );

describe('SideNav', () => {
  it('should render the shared SiteHeader with the locale', () => {
    renderSideNav();
    expect(screen.getByRole('button', { name: 'header' })).toHaveAttribute(
      'data-locale',
      'en-US',
    );
  });

  it('should render the primary and secondary slots in the nav landmark', () => {
    renderSideNav();
    const nav = screen.getByRole('navigation', { name: 'mainNav' });
    expect(nav).toContainElement(screen.getByText('primary item'));
    expect(nav).toContainElement(screen.getByText('secondary item'));
  });

  it('should keep the drawer offscreen until the header toggles it open', async () => {
    renderSideNav();
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('translate-x-full');

    await userEvent.click(screen.getByRole('button', { name: 'header' }));

    expect(nav).toHaveClass('translate-x-0');
  });

  it('should provide a working closeMenu to descendants via context', async () => {
    renderSideNav(<CloseButton />);
    const header = screen.getByRole('button', { name: 'header' });

    await userEvent.click(header);
    expect(header).toHaveAttribute('data-open', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(header).toHaveAttribute('data-open', 'false');
  });
});
