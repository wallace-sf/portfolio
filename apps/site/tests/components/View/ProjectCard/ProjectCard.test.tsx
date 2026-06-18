import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => 'en-US',
}));

vi.mock('~hooks', () => ({
  useBreakpoint: () => false,
}));

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string; className?: string }) => (
    <span data-testid={`icon-${icon}`} />
  ),
}));

vi.mock('@repo/ui/Control', () => ({
  Button: {
    Clipboard: ({
      children,
      className,
    }: {
      children: ((copied: boolean) => React.ReactNode) | React.ReactNode;
      className?: string;
    }) => (
      <button className={className}>
        {children instanceof Function ? children(false) : children}
      </button>
    ),
    Link: ({
      children,
      href,
      className,
    }: {
      children: React.ReactNode;
      href: string;
      className?: string;
    }) => (
      <a href={href} className={className}>
        {children}
      </a>
    ),
  },
}));

vi.mock('~/features/shared/SkillGroup', () => ({
  SkillGroup: () => <div data-testid="skill-group" />,
}));

vi.mock('~features/about/TechnologiesModal', () => ({
  TechnologiesModal: () => null,
}));

import { ProjectCard } from '~/features/home/ProjectsSection';

const defaultProps = {
  view: 'grid' as const,
  slug: 'my-project',
  title: 'My Project',
  caption: 'A great project',
  coverImage: { url: 'https://example.com/image.jpg', alt: 'My project cover' },
  skills: [
    { name: 'React', icon: '' },
    { name: 'TypeScript', icon: '' },
  ],
};

describe('ProjectCard', () => {
  it('should render a link to the project detail page', () => {
    render(<ProjectCard {...defaultProps} />);
    const link = screen.getByRole('link', {
      name: /ProjectCard\.view_project/i,
    });
    expect(link).toHaveAttribute('href', '/en-US/projects/my-project');
  });

  it('should render the cover image with the provided alt text', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByAltText('My project cover')).toBeInTheDocument();
  });

  it('should render title and caption', () => {
    render(<ProjectCard {...defaultProps} />);
    expect(screen.getByText('My Project')).toBeInTheDocument();
    expect(screen.getByText('A great project')).toBeInTheDocument();
  });

  it('should render the theme label when provided', () => {
    render(<ProjectCard {...defaultProps} theme="Web App" />);
    expect(screen.getByText('Web App')).toBeInTheDocument();
  });
});
