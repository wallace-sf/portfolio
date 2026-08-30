import { render } from '@testing-library/react';

import { SiteLogo } from '~/components/Layout/SiteLogo';

describe('SiteLogo', () => {
  it('should render an svg hidden from assistive tech when rendered', () => {
    const { container } = render(<SiteLogo />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });

  it('should forward props such as className to the svg element when provided', () => {
    const { container } = render(<SiteLogo className="size-4" />);

    expect(container.querySelector('svg')).toHaveClass('size-4');
  });
});
