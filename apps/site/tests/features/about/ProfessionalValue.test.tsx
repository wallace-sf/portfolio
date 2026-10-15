import { render, screen } from '@testing-library/react';

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid="icon" data-icon={icon} className={className} />
  ),
}));

import { ProfessionalValueCard } from '~features/about/ValuesSection/ProfessionalValueCard';

const defaultProps = {
  id: '1',
  icon: 'material-symbols:diamond',
  children: (
    <p>
      High quality <strong>delivery</strong>
    </p>
  ),
};

describe('ProfessionalValueCard', () => {
  it('should render the icon with brand-accent color', () => {
    render(<ProfessionalValueCard {...defaultProps} />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('data-icon', 'material-symbols:diamond');
    expect(icon.className).toContain('text-brand-accent');
  });

  it('should render the icon at 48px size', () => {
    render(<ProfessionalValueCard {...defaultProps} />);
    expect(screen.getByTestId('icon').className).toContain('text-[48px]');
  });

  it('should render the value statement inside the card', () => {
    render(<ProfessionalValueCard {...defaultProps} />);
    const strong = screen.getByText('delivery');
    expect(strong.tagName).toBe('STRONG');
    expect(strong.closest('article')).toBeInTheDocument();
  });

  it('should render as article element', () => {
    const { container } = render(<ProfessionalValueCard {...defaultProps} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });
});
