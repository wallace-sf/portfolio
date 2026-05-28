/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@iconify/react', () => ({
  Icon: ({ icon }: { icon: string }) => (
    <span data-testid="icon" data-icon={icon} />
  ),
}));

const mockLock = vi.fn();
const mockUnlock = vi.fn();

vi.mock('usehooks-ts', () => ({
  useScrollLock: () => ({ lock: mockLock, unlock: mockUnlock, isLocked: false }),
  useOnClickOutside: vi.fn(),
  useEventListener: vi.fn(),
  useToggle: (initial = false) => {
    const React = require('react');
    const [state, setState] = React.useState(initial);
    return [state, () => setState((s: boolean) => !s)];
  },
}));

vi.mock('@repo/ui/Control', async () => {
  const actual = await vi.importActual<typeof import('@repo/ui/Control')>(
    '@repo/ui/Control',
  );
  return actual;
});

import { TechnologiesModal } from '~features/about/TechnologiesModal';

const TECHS_WITHOUT_DESCRIPTIONS = [
  { name: 'React', icon: 'logos:react' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
];

const TECHS_WITH_DESCRIPTIONS = [
  { name: 'React', icon: 'logos:react', description: 'UI library' },
  { name: 'TypeScript', icon: 'logos:typescript-icon', description: 'Typed JS' },
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

    expect(screen.queryByText('Tecnologias utilizadas')).not.toBeInTheDocument();
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

    expect(screen.getByText('Tecnologias utilizadas')).toBeInTheDocument();
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

    expect(screen.queryByText('Ver detalhes')).not.toBeInTheDocument();
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

    expect(screen.getByText('Ver detalhes')).toBeInTheDocument();
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

    fireEvent.click(screen.getByText('Ver detalhes'));

    expect(screen.getByText('Visão compacta')).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole('button', { name: /fechar modal/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
