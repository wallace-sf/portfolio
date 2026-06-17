import { fireEvent, render, screen } from '@testing-library/react';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt-BR',
}));

vi.mock('@repo/ui/Imagery', () => ({
  Icon: ({ icon }: { icon: string }) => <span data-testid="icon">{icon}</span>,
}));

vi.mock('@repo/ui/View', () => ({
  TextRich: ({
    content,
    className,
  }: {
    content: string;
    className?: string;
  }) => <p className={className}>{content}</p>,
  Badge: {
    WithIcon: ({ label }: { label: string; icon: string }) => (
      <span>{label}</span>
    ),
    Text: ({ label }: { label: string }) => <span>{label}</span>,
    Count: ({ count }: { count: number }) => <span>+{count}</span>,
  },
}));

vi.mock('~/features/shared/TechnologiesModal', () => ({
  TechnologiesModal: ({
    open,
    company,
  }: {
    open: boolean;
    company?: string;
    onClose: () => void;
    technologies: unknown[];
  }) => (open ? <div data-testid="technologies-modal">{company}</div> : null),
}));

import {
  ExperienceCard,
  calculateDuration,
} from '~/features/about/ExperiencesSection';

// ---------------------------------------------------------------------------
// calculateDuration unit tests
// ---------------------------------------------------------------------------

describe('calculateDuration', () => {
  it('should return years and months for multi-year range', () => {
    expect(calculateDuration('2022-01-01', '2023-04-01')).toBe('1a 3m');
  });

  it('should return only years when months is zero', () => {
    expect(calculateDuration('2021-03-01', '2023-03-01')).toBe('2a');
  });

  it('should return only months for sub-year range', () => {
    expect(calculateDuration('2023-06-01', '2023-09-01')).toBe('3m');
  });

  it('should use today when endAt is not provided', () => {
    const result = calculateDuration('2020-01-01');
    expect(result).toMatch(/^\d+a(\s\d+m)?$|^\d+m$/);
  });

  it('should return 1m as minimum when duration rounds to zero', () => {
    expect(calculateDuration('2023-01-15', '2023-01-20')).toBe('1m');
  });
});

// ---------------------------------------------------------------------------
// ExperienceCard component tests
// ---------------------------------------------------------------------------

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
  it('should render position as h2', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Senior Developer' }),
    ).toBeInTheDocument();
  });

  it('should render company in uppercase', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByText('Acme Corp')).toHaveClass('uppercase');
  });

  it('should render location, employmentType and locationType as separate labelled items', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByText('São Paulo, Brazil')).toBeInTheDocument();
    expect(screen.getByText('employment_type.FULL_TIME')).toBeInTheDocument();
    expect(screen.getByText('location_type.REMOTE')).toBeInTheDocument();
  });

  it('should render icons for location, employmentType and locationType', () => {
    render(<ExperienceCard {...defaultProps} />);
    const icons = screen.getAllByTestId('icon');
    expect(icons[0]).toHaveTextContent('mdi:map-marker-outline');
    expect(icons[1]).toHaveTextContent('mdi:briefcase-outline');
    expect(icons[2]).toHaveTextContent('mdi:home-outline');
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

  it('should clamp description by default and show see_more button', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByText('Full-stack development.')).toHaveClass(
      'line-clamp-1',
    );
    expect(
      screen.getByRole('button', { name: 'see_more' }),
    ).toBeInTheDocument();
  });

  it('should expand description when see_more is clicked', () => {
    render(<ExperienceCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'see_more' }));
    expect(screen.getByText('Full-stack development.')).not.toHaveClass(
      'line-clamp-1',
    );
    expect(
      screen.getByRole('button', { name: 'see_less' }),
    ).toBeInTheDocument();
  });

  it('should collapse description when see_less is clicked', () => {
    render(<ExperienceCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'see_more' }));
    fireEvent.click(screen.getByRole('button', { name: 'see_less' }));
    expect(screen.getByText('Full-stack development.')).toHaveClass(
      'line-clamp-1',
    );
  });

  it('should render up to 2 skill badges on mobile', () => {
    const fiveSkills = [
      { name: 'React', icon: '' },
      { name: 'TypeScript', icon: '' },
      { name: 'Node.js', icon: '' },
      { name: 'PostgreSQL', icon: '' },
      { name: 'Docker', icon: '' },
    ];
    render(<ExperienceCard {...defaultProps} skills={fiveSkills} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
    expect(screen.queryByText('PostgreSQL')).not.toBeInTheDocument();
    expect(screen.queryByText('Docker')).not.toBeInTheDocument();
  });

  it('should show +N badge when skills exceed the visible max', () => {
    const fiveSkills = Array.from({ length: 5 }, (_, i) => ({
      name: `Skill${i}`,
      icon: '',
    }));
    render(<ExperienceCard {...defaultProps} skills={fiveSkills} />);
    expect(screen.getByRole('button', { name: 'show_more' })).toBeInTheDocument();
  });

  it('should not show +N badge when skills are 2 or fewer', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(
      screen.queryByRole('button', { name: /^\+\d/ }),
    ).not.toBeInTheDocument();
  });

  it('should open TechnologiesModal when +N badge is clicked', () => {
    const fiveSkills = Array.from({ length: 5 }, (_, i) => ({
      name: `Skill${i}`,
      icon: '',
    }));
    render(<ExperienceCard {...defaultProps} skills={fiveSkills} />);
    fireEvent.click(screen.getByRole('button', { name: 'show_more' }));
    expect(screen.getByTestId('technologies-modal')).toBeInTheDocument();
  });

  it('should show present key when endAt is not provided', () => {
    const { endAt: _, ...props } = defaultProps;
    render(<ExperienceCard {...props} />);
    expect(screen.getByText(/present/i)).toBeInTheDocument();
  });
});
