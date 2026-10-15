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

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

vi.mock('@repo/ui/View', () => ({
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

import { ExperienceCard } from '~/features/about/ExperiencesSection';

// ---------------------------------------------------------------------------
// ExperienceCard component tests
// ---------------------------------------------------------------------------

const defaultProps = {
  id: '1',
  company: 'Acme Corp',
  position: 'Senior Developer',
  location: 'São Paulo, Brazil',
  children: <p>Full-stack development.</p>,
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

/** The container that wraps (and clamps) the rendered description. */
const description = () =>
  screen.getByText('Full-stack development.').parentElement;

describe('ExperienceCard', () => {
  it('should render position as h3', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Senior Developer' }),
    ).toBeInTheDocument();
  });

  it('should render company in uppercase', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByText('Acme Corp')).toHaveClass('uppercase');
  });

  it('should render the company logo when provided', () => {
    render(<ExperienceCard {...defaultProps} />);
    const logo = screen.getByAltText('Acme logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
  });

  it('should not render a logo when not provided', () => {
    const { logo: _, ...props } = defaultProps;
    render(<ExperienceCard {...props} />);
    expect(screen.queryByAltText('Acme logo')).not.toBeInTheDocument();
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

  it('should render the description when provided', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(screen.getByText('Full-stack development.')).toBeInTheDocument();
  });

  it('should render neither the description nor the toggle when not provided', () => {
    const { children: _, ...props } = defaultProps;
    render(<ExperienceCard {...props} />);
    expect(
      screen.queryByText('Full-stack development.'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'see_more' }),
    ).not.toBeInTheDocument();
  });

  it('should clamp description by default and show see_more button', () => {
    render(<ExperienceCard {...defaultProps} />);
    expect(description()).toHaveClass('line-clamp-3');
    expect(
      screen.getByRole('button', { name: 'see_more' }),
    ).toBeInTheDocument();
  });

  it('should expand description when see_more is clicked', () => {
    render(<ExperienceCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'see_more' }));
    expect(description()).not.toHaveClass('line-clamp-3');
    expect(
      screen.getByRole('button', { name: 'see_less' }),
    ).toBeInTheDocument();
  });

  it('should collapse description when see_less is clicked', () => {
    render(<ExperienceCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'see_more' }));
    fireEvent.click(screen.getByRole('button', { name: 'see_less' }));
    expect(description()).toHaveClass('line-clamp-3');
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
    expect(
      screen.getByRole('button', { name: 'show_more' }),
    ).toBeInTheDocument();
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
