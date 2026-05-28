import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@repo/ui/View', () => ({
  TextRich: ({
    content,
    className,
  }: {
    content: string;
    className?: string;
  }) => <p className={className}>{content}</p>,
}));

vi.mock('~features/shared/SkillGroup', () => ({
  SkillGroup: ({
    onShowAll,
    total,
  }: {
    skills: unknown[];
    max: number;
    total: number;
    initializeWithMax: number;
    onShowAll?: () => void;
  }) => (
    <div data-testid="skill-group">
      {onShowAll && total > 3 && (
        <button type="button" onClick={onShowAll} data-testid="show-all">
          +{total - 3}
        </button>
      )}
    </div>
  ),
}));

vi.mock('~features/about/TechnologiesModal', () => ({
  TechnologiesModal: ({
    open,
    company,
  }: {
    open: boolean;
    company?: string;
    onClose: () => void;
    technologies: unknown[];
  }) =>
    open ? (
      <div data-testid="technologies-modal">{company}</div>
    ) : null,
}));

import { ExperienceCard } from '~/features/about/ExperiencesSection';

const defaultProps = {
  id: '1',
  company: 'Acme Corp',
  position: 'Senior Developer',
  location: 'São Paulo, Brazil',
  description: 'Full-stack development.',
  logo: { url: 'https://example.com/logo.png', alt: 'Acme logo' },
  employmentType: 'FULL_TIME',
  locationType: 'REMOTE',
  startAt: '2023-01-01T00:00:00.000Z',
  endAt: '2024-01-01T00:00:00.000Z',
  skills: [
    { name: 'React', icon: '' },
    { name: 'TypeScript', icon: '' },
  ],
};

describe('ExperienceCard', () => {
  it('should render position and company', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('should render location', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByText('São Paulo, Brazil')).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByText('Full-stack development.')).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const { description: _, ...props } = defaultProps;
    render(<ExperienceCard {...props} />);
    expect(
      screen.queryByText('Full-stack development.'),
    ).not.toBeInTheDocument();
  });

  it('should render SkillGroup when skills are provided', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByTestId('skill-group')).toBeInTheDocument();
  });

  it('should open TechnologiesModal when show-all is triggered', () => {
    const manySkills = Array.from({ length: 5 }, (_, i) => ({
      name: `Skill${i}`,
      icon: '',
    }));
    render(<ExperienceCard {...defaultProps} skills={manySkills} />);

    fireEvent.click(screen.getByTestId('show-all'));

    expect(screen.getByTestId('technologies-modal')).toBeInTheDocument();
  });
});
