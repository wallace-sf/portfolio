import { render, screen } from '@testing-library/react';

vi.mock('@repo/ui/View', () => ({
  TextRich: ({ content, className }: { content: string; className?: string }) => (
    <p className={className}>{content}</p>
  ),
}));

vi.mock('~/features/about/ExperiencesSection/SkillAccordion', () => ({
  SkillAccordion: ({ skills }: { skills: string[] }) => (
    <div data-testid="skill-accordion">{skills.join(',')}</div>
  ),
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
  skills: ['React', 'TypeScript'],
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
    expect(screen.queryByText('Full-stack development.')).not.toBeInTheDocument();
  });

  it('should pass skills to SkillAccordion', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByTestId('skill-accordion')).toHaveTextContent('React,TypeScript');
  });
});
