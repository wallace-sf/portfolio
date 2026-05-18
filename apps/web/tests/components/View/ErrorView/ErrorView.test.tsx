import { render, screen, fireEvent } from '@testing-library/react';

import { ErrorView } from '~/features/shared/ErrorView';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockReset = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ErrorView', () => {
  it('should render the error title', () => {
    render(<ErrorView reset={mockReset} />);

    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should render the error description', () => {
    render(<ErrorView reset={mockReset} />);

    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('should render the retry button', () => {
    render(<ErrorView reset={mockReset} />);

    expect(screen.getByRole('button', { name: 'retry' })).toBeInTheDocument();
  });

  it('should call reset when the retry button is clicked', () => {
    render(<ErrorView reset={mockReset} />);

    fireEvent.click(screen.getByRole('button', { name: 'retry' }));

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
