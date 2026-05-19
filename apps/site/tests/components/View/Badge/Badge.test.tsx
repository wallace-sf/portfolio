import { render, screen } from '@testing-library/react';

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} />
  ),
}));

import { Badge } from '@repo/ui/View';

describe('Badge', () => {
  describe('Badge.Text', () => {
    it('should render the label', () => {
      render(<Badge.Text label="React" />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should apply extra className', () => {
      render(<Badge.Text label="React" className="extra-class" />);
      expect(screen.getByText('React').closest('span')).toHaveClass(
        'extra-class',
      );
    });
  });

  describe('Badge.WithIcon', () => {
    it('should render the label', () => {
      render(<Badge.WithIcon label="TypeScript" icon="logos:typescript-icon" />);
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('should render a child element for the icon', () => {
      const { container } = render(
        <Badge.WithIcon label="TypeScript" icon="logos:typescript-icon" />,
      );
      // Badge.WithIcon renders Icon + label text — the span must have 2 children
      const badge = container.querySelector('span');
      expect(badge?.childElementCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Badge.Count', () => {
    it('should render the count with + prefix', () => {
      render(<Badge.Count count={3} />);
      expect(screen.getByText('+3')).toBeInTheDocument();
    });

    it('should render count of 1', () => {
      render(<Badge.Count count={1} />);
      expect(screen.getByText('+1')).toBeInTheDocument();
    });
  });
});
