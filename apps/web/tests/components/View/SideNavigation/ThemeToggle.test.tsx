import { render, screen, fireEvent } from '@testing-library/react';

import { ThemeToggle } from '~/components/View/SideNavigation/ThemeToggle';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockSetTheme = vi.fn();

vi.mock('~hooks', () => ({
  useTheme: () => ({ theme: 'system', setTheme: mockSetTheme }),
  useDarkMode: () => false,
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('~/components/View/MenuItem/index', () => ({
  MenuItem: {
    Item2: {
      Expandable: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="theme-expandable">{children}</div>
      ),
    },
  },
}));

vi.mock('@repo/ui/Control', () => ({
  RadioGroup: ({
    children,
    name,
    value,
    onChange,
  }: {
    children: (args: {
      name: string;
      value: string;
      onChange: React.ChangeEventHandler<HTMLInputElement>;
    }) => React.ReactNode;
    name: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    containerElementType?: string;
    className?: string;
  }) => <ul>{children({ name, value, onChange })}</ul>,
  Radio: ({
    children,
    option,
    onChange,
    name,
  }: {
    children: React.ReactNode;
    id: string;
    name: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    option: string;
    icon: string;
    iconClassName?: string;
  }) => (
    <label>
      <input
        type="radio"
        name={name}
        value={option}
        onChange={onChange}
        data-testid={`radio-${option}`}
      />
      {children}
    </label>
  ),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ThemeToggle', () => {
  it('should render all three theme options', () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId('radio-light')).toBeInTheDocument();
    expect(screen.getByTestId('radio-dark')).toBeInTheDocument();
    expect(screen.getByTestId('radio-system')).toBeInTheDocument();
  });

  it('should call setTheme with "light" when light radio is selected', () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByTestId('radio-light'));

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with "dark" when dark radio is selected', () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByTestId('radio-dark'));

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setTheme with "system" when system radio is selected', () => {
    render(<ThemeToggle />);

    fireEvent.click(screen.getByTestId('radio-system'));

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('should render the expandable theme container', () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId('theme-expandable')).toBeInTheDocument();
  });
});
