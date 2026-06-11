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
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key}:${JSON.stringify(values)}` : key,
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
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
    technologies: unknown[];
  }) =>
    open ? (
      <div data-testid="technologies-modal">
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));

import { SkillGroup } from '~/features/shared/SkillGroup';

const skills = [
  { name: 'React', icon: '' },
  { name: 'TypeScript', icon: '' },
  { name: 'Node.js', icon: '' },
  { name: 'CSS', icon: '' },
  { name: 'GraphQL', icon: '' },
];

describe('SkillGroup', () => {
  it('should render skills up to max', () => {
    render(
      <SkillGroup max={3} total={5} skills={skills} initializeWithMax={3} />,
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.queryByText('CSS')).not.toBeInTheDocument();
  });

  it('should render overflow button with aria-label when skills exceed max', () => {
    render(
      <SkillGroup max={3} total={5} skills={skills} initializeWithMax={3} />,
    );

    const overflowButton = screen.getByRole('button');
    expect(overflowButton).toHaveAttribute('aria-label');
    expect(overflowButton.getAttribute('aria-label')).toContain('show_more');
  });

  it('should not render overflow button when skills fit within max', () => {
    render(
      <SkillGroup max={5} total={5} skills={skills} initializeWithMax={5} />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should open TechnologiesModal when overflow button is clicked', () => {
    render(
      <SkillGroup max={3} total={5} skills={skills} initializeWithMax={3} />,
    );

    expect(screen.queryByTestId('technologies-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('technologies-modal')).toBeInTheDocument();
  });
});
