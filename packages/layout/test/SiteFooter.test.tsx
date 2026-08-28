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

  it('should apply the shared footer-band classes when rendered', () => {
    render(
      <SiteFooter>
        <span>x</span>
      </SiteFooter>,
    );

    expect(screen.getByRole('contentinfo')).toHaveClass(
      'mx-auto',
      'w-full',
      'max-w-237.5',
      'bg-surface-overlay',
      'py-10',
      'shadow-drop-up',
    );
  });
});
