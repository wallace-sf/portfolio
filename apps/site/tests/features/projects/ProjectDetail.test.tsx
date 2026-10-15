/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) =>
    `${namespace}.${key}`,
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
  children: <h1>Hello</h1>,
  relatedProjects: [],
};

describe('projects/ProjectDetail', () => {
  it('should render the project URL link when projectUrl is provided', async () => {
    const { ProjectDetail } = await import('~features/projects/ProjectDetail');

    render(
      <ProjectDetail
        {...BASE_PROPS}
        projectUrl="https://tcrepresentacoes.com.br"
      />,
    );

    const link = screen.getByRole('link', {
      name: 'ProjectDetail.project_url_label',
    });
    expect(link).toHaveAttribute('href', 'https://tcrepresentacoes.com.br');
  });

  it('should not render the project URL link when projectUrl is absent', async () => {
    const { ProjectDetail } = await import('~features/projects/ProjectDetail');

    render(<ProjectDetail {...BASE_PROPS} role="Engineer" />);

    expect(
      screen.queryByText('ProjectDetail.project_url_label'),
    ).not.toBeInTheDocument();
  });

  it('should render the body inside the article when one is given', async () => {
    const { ProjectDetail } = await import('~features/projects/ProjectDetail');

    render(<ProjectDetail {...BASE_PROPS} />);

    expect(
      screen.getByRole('heading', { name: 'Hello' }).closest('article'),
    ).toBeInTheDocument();
  });
});
