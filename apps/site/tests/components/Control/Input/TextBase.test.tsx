import { render, screen } from '@testing-library/react';

import { Text } from '@repo/ui/Control';

describe('Text.Base', () => {
  const defaultProps = {
    type: 'text' as const,
    placeholder: 'Enter text',
  };

  it('should render an input', () => {
    render(<Text.Base {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should apply default border styling', () => {
    render(<Text.Base {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input.className).toContain('border-content-disabled');
  });

  it('should apply error border when error and touched', () => {
    render(<Text.Base {...defaultProps} error touched />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input.className).toContain('border-error');
  });

  it('should apply success border when no error and touched', () => {
    render(<Text.Base {...defaultProps} error={false} touched />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input.className).toContain('border-success');
  });

  it('should show icon indicator on error state', () => {
    const { container } = render(<Text.Base {...defaultProps} error touched />);
    expect(container.querySelector('.pointer-events-none')).toBeInTheDocument();
  });

  it('should show icon indicator on success state', () => {
    const { container } = render(
      <Text.Base {...defaultProps} error={false} touched />,
    );
    expect(container.querySelector('.pointer-events-none')).toBeInTheDocument();
  });

  it('should not show icon indicator when untouched', () => {
    const { container } = render(<Text.Base {...defaultProps} error />);
    expect(container.querySelector('.pointer-events-none')).not.toBeInTheDocument();
  });

  it('should render without styling when unstyled', () => {
    render(<Text.Base {...defaultProps} unstyled />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input.className).not.toContain('border-content-disabled');
  });
});
