import { render, screen } from '@testing-library/react';

import { OpenSourceBadge } from '~/features/shared/OpenSourceBadge';

describe('OpenSourceBadge', () => {
  it('should render a link pointing to the repository', () => {
    render(<OpenSourceBadge repositoryUrl="https://github.com/user/repo" />);

    const link = screen.getByRole('link', { name: /open source/i });
    expect(link).toHaveAttribute('href', 'https://github.com/user/repo');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should display the open source label', () => {
    render(<OpenSourceBadge repositoryUrl="https://github.com/user/repo" />);
    expect(screen.getByText('Open Source')).toBeInTheDocument();
  });
});
