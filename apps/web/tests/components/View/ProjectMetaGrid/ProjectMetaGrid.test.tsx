import { render, screen } from '@testing-library/react';

import { ProjectMetaGrid } from '~/features/projects/ProjectDetail/ProjectMetaGrid';

const labels = {
  summary: 'Summary',
  objectives: 'Objectives',
  role: 'Role',
  period: 'Period',
};

describe('ProjectMetaGrid', () => {
  it('should always render the period label', () => {
    render(
      <ProjectMetaGrid
        period={{ startAt: '2024-01-01', endAt: '2024-12-31' }}
        labels={labels}
      />,
    );
    expect(screen.getByText('Period')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('should format period as range when years differ', () => {
    render(
      <ProjectMetaGrid
        period={{ startAt: '2022-01-01', endAt: '2024-12-31' }}
        labels={labels}
      />,
    );
    expect(screen.getByText('2022 – 2024')).toBeInTheDocument();
  });

  it('should render optional fields when provided', () => {
    render(
      <ProjectMetaGrid
        summary="A great project"
        role="Frontend Developer"
        period={{ startAt: '2023-01-01' }}
        labels={labels}
      />,
    );
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('A great project')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });

  it('should not render absent optional fields', () => {
    render(
      <ProjectMetaGrid period={{ startAt: '2024-01-01' }} labels={labels} />,
    );
    expect(screen.queryByText('Summary')).not.toBeInTheDocument();
    expect(screen.queryByText('Objectives')).not.toBeInTheDocument();
    expect(screen.queryByText('Role')).not.toBeInTheDocument();
  });
});
