/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('~i18n/routing', () => ({
  Link: ({ children, ...props }: React.ComponentProps<'a'>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-icon={icon} />,
}));

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
  TextRich: ({ content }: { content: string }) => <div>{content}</div>,
}));

vi.mock('~features/home/ProjectsSection/ProjectList', () => ({
  ProjectList: () => <div data-testid="project-list" />,
}));

vi.mock('~features/shared/Breadcrumb', () => ({
  Breadcrumb: () => <nav data-testid="breadcrumb" />,
}));

vi.mock('~features/shared/OpenSourceBadge', () => ({
  OpenSourceBadge: () => <span data-testid="open-source-badge" />,
}));

vi.mock('~features/shared/SkillGroup', () => ({
  SkillGroup: () => <div data-testid="skill-group" />,
}));

const BASE_PROPS = {
  slug: 'my-project',
  title: 'My Project',
  caption: 'A great project',
  coverImage: { url: 'https://example.com/cover.jpg', alt: 'Cover' },
  skills: [],
  period: { startAt: '2024-01-01' },
  content: '# Hello',
  relatedProjects: [],
};

describe('projects/ProjectDetail', () => {
  it('should render the live URL link when liveUrl is provided', async () => {
    const { ProjectDetail } = await import('~features/projects/ProjectDetail');

    render(
      <ProjectDetail
        {...BASE_PROPS}
        liveUrl="https://tcrepresentacoes.com.br"
      />,
    );

    expect(screen.getByText('ProjectDetail.live_url_label')).toBeInTheDocument();
    const link = screen.getByRole('link', {
      name: 'https://tcrepresentacoes.com.br',
    });
    expect(link).toHaveAttribute('href', 'https://tcrepresentacoes.com.br');
  });

  it('should not render the live URL link when liveUrl is absent', async () => {
    const { ProjectDetail } = await import('~features/projects/ProjectDetail');

    render(<ProjectDetail {...BASE_PROPS} role="Engineer" />);

    expect(
      screen.queryByText('ProjectDetail.live_url_label'),
    ).not.toBeInTheDocument();
  });
});
