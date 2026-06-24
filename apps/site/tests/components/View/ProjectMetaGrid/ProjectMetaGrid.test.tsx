import { render, screen } from '@testing-library/react';

import { ProjectMetaGrid } from '~/features/projects/ProjectDetail/ProjectMetaGrid';

const labels = { role: 'Role' };

describe('ProjectMetaGrid', () => {
  it('should render role when provided', () => {
    render(<ProjectMetaGrid role="Frontend Developer" labels={labels} />);
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
  });

  it('should render nothing when role is absent', () => {
    const { container } = render(<ProjectMetaGrid labels={labels} />);
    expect(container.firstChild).toBeNull();
  });
});
