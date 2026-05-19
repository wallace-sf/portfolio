import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} className={className} />
  ),
}));

import { StatCard } from '~/features/shared/StatCard';

const defaultProps = {
  label: 'Years of experience',
  value: '+5',
  icon: 'mdi:briefcase',
};

describe('StatCard', () => {
  it('should render the value', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('+5')).toBeInTheDocument();
  });

  it('should render the label', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByText('Years of experience')).toBeInTheDocument();
  });

  it('should render the icon with the correct icon prop', () => {
    render(<StatCard {...defaultProps} />);
    expect(screen.getByTestId('icon-mdi:briefcase')).toBeInTheDocument();
  });

  it('should render as an article element', () => {
    const { container } = render(<StatCard {...defaultProps} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });
});
