/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid="icon" data-icon={icon} />
  ),
}));

const mockLock = vi.fn();
const mockUnlock = vi.fn();

vi.mock('usehooks-ts', () => ({
  useScrollLock: () => ({
    lock: mockLock,
    unlock: mockUnlock,
    isLocked: false,
  }),
  useOnClickOutside: vi.fn(),
  useEventListener: vi.fn(),
  useToggle: (initial = false) => {
    const React = require('react');
    const [state, setState] = React.useState(initial);
    return [state, () => setState((s: boolean) => !s)];
  },
}));

vi.mock('@repo/ui/Control', async () => {
  const actual =
    await vi.importActual<typeof import('@repo/ui/Control')>(
      '@repo/ui/Control',
    );
  return actual;
});

import { TechnologiesModal } from '~/features/shared/TechnologiesModal';

const TECHS_WITHOUT_DESCRIPTIONS = [
  { name: 'React', icon: 'logos:react' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
];

const TECHS_WITH_DESCRIPTIONS = [
  { name: 'React', icon: 'logos:react', description: 'UI library' },
  {
    name: 'TypeScript',
    icon: 'logos:typescript-icon',
    description: 'Typed JS',
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TechnologiesModal', () => {
  it('should not render when closed', () => {
    render(
      <TechnologiesModal
        open={false}
        onClose={vi.fn()}
        company="Acme"
        position="Dev"
        technologies={TECHS_WITHOUT_DESCRIPTIONS}
      />,
    );

    expect(screen.queryByText('title')).not.toBeInTheDocument();
  });

  it('should render title, company and position when open', () => {
    render(
      <TechnologiesModal
        open
        onClose={vi.fn()}
        company="Acme Corp"
        position="Frontend Dev"
        technologies={TECHS_WITHOUT_DESCRIPTIONS}
      />,
    );

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Frontend Dev')).toBeInTheDocument();
  });

  it('should render all technology badges in basic state', () => {
    render(
      <TechnologiesModal
        open
        onClose={vi.fn()}
        company="Acme"
        position="Dev"
        technologies={TECHS_WITHOUT_DESCRIPTIONS}
      />,
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should not show toggle button when technologies have no descriptions', () => {
    render(
      <TechnologiesModal
        open
        onClose={vi.fn()}
        company="Acme"
        position="Dev"
        technologies={TECHS_WITHOUT_DESCRIPTIONS}
      />,
    );

    expect(screen.queryByText('viewDetails')).not.toBeInTheDocument();
  });

  it('should show toggle button when technologies have descriptions', () => {
    render(
      <TechnologiesModal
        open
        onClose={vi.fn()}
        company="Acme"
        position="Dev"
        technologies={TECHS_WITH_DESCRIPTIONS}
      />,
    );

    expect(screen.getByText('viewDetails')).toBeInTheDocument();
  });

  it('should switch to detailed state showing accordion items', () => {
    render(
      <TechnologiesModal
        open
        onClose={vi.fn()}
        company="Acme"
        position="Dev"
        technologies={TECHS_WITH_DESCRIPTIONS}
      />,
    );

    fireEvent.click(screen.getByText('viewDetails'));

    expect(screen.getByText('compactView')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <TechnologiesModal
        open
        onClose={onClose}
        company="Acme"
        position="Dev"
        technologies={TECHS_WITHOUT_DESCRIPTIONS}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /^close$/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
