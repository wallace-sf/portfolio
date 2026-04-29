import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock('~hooks', () => ({
  useBreakpoint: () => false,
}));

vi.mock('@repo/ui/Control', () => ({
  Button: {
    Base: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <button className={className}>{children}</button>,
    Clipboard: ({
      children,
      tooltip,
    }: {
      children: (copied: boolean) => React.ReactNode;
      tooltip: string;
      text: string;
      className?: string;
    }) => <button aria-label={tooltip}>{children(false)}</button>,
  },
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} />
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

vi.mock('~/components/View/SkillGroup', () => ({
  SkillGroup: () => <div data-testid="skill-group" />,
}));

import { ProjectCard } from '~/components/View/ProjectCard';

const defaultProps = {
  view: 'grid' as const,
  title: 'My Project',
  caption: 'A great project',
  skills: ['React', 'TypeScript'],
};

describe('ProjectCard', () => {
  it('should render the translated view_project button', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /ProjectCard\.view_project/i }),
    ).toBeInTheDocument();
  });

  it('should render the image with translated alt text', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByAltText('ProjectCard.image_alt')).toBeInTheDocument();
  });

  it('should render the clipboard button with translated tooltip', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: 'Clipboard.copy' }),
    ).toBeInTheDocument();
  });

  it('should render title and caption', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
    expect(screen.getByText('A great project')).toBeInTheDocument();
  });
});
