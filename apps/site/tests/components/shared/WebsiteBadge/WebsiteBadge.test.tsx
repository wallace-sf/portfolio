import { render, screen } from '@testing-library/react';

import { WebsiteBadge } from '~/features/shared/WebsiteBadge';

describe('WebsiteBadge', () => {
  it('should render a link pointing to the project URL', () => {
    render(<WebsiteBadge projectUrl="https://example.com" label="Website" />);

    const link = screen.getByRole('link', { name: /website/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should display the given label', () => {
    render(<WebsiteBadge projectUrl="https://example.com" label="Website" />);
    expect(screen.getByText('Website')).toBeInTheDocument();
  });
});
