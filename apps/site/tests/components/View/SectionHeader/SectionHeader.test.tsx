import { render, screen } from '@testing-library/react';

import { SectionHeader } from '@repo/ui/View';

describe('SectionHeader', () => {
  it('should render title', () => {
    render(<SectionHeader title="Projects" />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('should render title as h2 by default', () => {
    render(<SectionHeader title="Projects" />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Projects' }),
    ).toBeInTheDocument();
  });

  it('should render title as h3 when as=h3', () => {
    render(<SectionHeader title="Projects" as="h3" />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Projects' }),
    ).toBeInTheDocument();
  });

  it('should render overline when provided', () => {
    render(<SectionHeader title="Projects" overline="FEATURED WORK" />);
    expect(screen.getByText('FEATURED WORK')).toBeInTheDocument();
  });

  it('should not render overline element when not provided', () => {
    render(<SectionHeader title="Projects" />);
    expect(screen.queryByRole('overline')).not.toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <SectionHeader title="Projects" description="A collection of my work." />,
    );
    expect(screen.getByText('A collection of my work.')).toBeInTheDocument();
  });

  it('should not render description element when not provided', () => {
    const { container } = render(<SectionHeader title="Projects" />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('should apply center alignment class when align=center', () => {
    const { container } = render(
      <SectionHeader title="Projects" align="center" />,
    );
    expect(container.firstChild).toHaveClass('items-center', 'text-center');
  });

  it('should not apply center alignment by default', () => {
    const { container } = render(<SectionHeader title="Projects" />);
    expect(container.firstChild).not.toHaveClass('items-center');
  });

  it('should forward extra className', () => {
    const { container } = render(
      <SectionHeader title="Projects" className="mt-8" />,
    );
    expect(container.firstChild).toHaveClass('mt-8');
  });
});
