import { render, screen } from '@testing-library/react';

import { SiteFooter } from '~/SiteFooter';

describe('SiteFooter', () => {
  it('should render its children inside a contentinfo landmark when given content', () => {
    render(
      <SiteFooter>
        <p>zone content</p>
      </SiteFooter>,
    );

    const footer = screen.getByRole('contentinfo');
    expect(footer.tagName).toBe('FOOTER');
    expect(footer).toContainElement(screen.getByText('zone content'));
  });

  it('should center the footer landmark and keep the surface band on an inner element', () => {
    render(
      <SiteFooter>
        <span>x</span>
      </SiteFooter>,
    );

    const footer = screen.getByRole('contentinfo');
    // Centering classes stay on the landmark, uncontested by the 2xl bleed.
    expect(footer).toHaveClass('mx-auto', 'w-full', 'max-w-237.5', 'shadow-drop-up');
    expect(footer).not.toHaveClass('2xl:mx-[-161px]');

    const band = footer.firstElementChild;
    expect(band).toHaveClass('bg-surface-overlay', 'py-10', '2xl:mx-[-161px]');
  });
});
