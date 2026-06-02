import { render, screen } from '@testing-library/react';

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon, className }: { icon: string; className?: string }) => (
    <span data-testid="icon" data-icon={icon} className={className} />
  ),
}));

vi.mock('@repo/ui/View', () => ({
  TextRich: ({
    content,
    className,
  }: {
    content: string;
    className?: string;
  }) => <p className={className}>{content}</p>,
}));

import { ProfessionalValueCard } from '~features/about/ValuesSection/ProfessionalValueCard';

const defaultProps = {
  id: '1',
  icon: 'material-symbols:diamond',
  content: 'High quality <strong>delivery</strong>',
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

  it('should render the content text', () => {
    render(<ProfessionalValueCard {...defaultProps} />);
    expect(
      screen.getByText('High quality <strong>delivery</strong>'),
    ).toBeInTheDocument();
  });

  it('should apply text-content-primary to the text', () => {
    render(<ProfessionalValueCard {...defaultProps} />);
    expect(
      screen.getByText('High quality <strong>delivery</strong>').className,
    ).toContain('text-content-primary');
  });

  it('should render as article element', () => {
    const { container } = render(<ProfessionalValueCard {...defaultProps} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });
});
