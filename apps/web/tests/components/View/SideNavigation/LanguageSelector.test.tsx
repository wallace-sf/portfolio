import { render, screen, fireEvent } from '@testing-library/react';

import { LanguageSelector } from '~/components/View/SideNavigation/LanguageSelector';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockReplace = vi.fn();
let mockPathname = '/about';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('~i18n/routing', () => ({
  usePathname: () => mockPathname,
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en-US',
}));

vi.mock('~/components/View/MenuItem/index', () => ({
  MenuItem: {
    Item2: {
      Expandable: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="language-expandable">{children}</div>
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
  mockPathname = '/about';
});

describe('LanguageSelector', () => {
  it('should render all three language options', () => {
    render(<LanguageSelector />);

    expect(screen.getByTestId('radio-en-US')).toBeInTheDocument();
    expect(screen.getByTestId('radio-pt-BR')).toBeInTheDocument();
    expect(screen.getByTestId('radio-es')).toBeInTheDocument();
  });

  it('should render the expandable language container', () => {
    render(<LanguageSelector />);

    expect(screen.getByTestId('language-expandable')).toBeInTheDocument();
  });

  it('should navigate to /<locale><pathname> when a language is selected on a non-root path', () => {
    render(<LanguageSelector />);

    fireEvent.click(screen.getByTestId('radio-pt-BR'));

    expect(mockReplace).toHaveBeenCalledWith('/pt-BR/about');
  });

  it('should navigate to <locale> when a language is selected on the root path', () => {
    mockPathname = '/';

    render(<LanguageSelector />);

    fireEvent.click(screen.getByTestId('radio-es'));

    expect(mockReplace).toHaveBeenCalledWith('es');
  });

  it('should call replace with "/en-US/<pathname>" when en-US radio is selected', () => {
    render(<LanguageSelector />);

    fireEvent.click(screen.getByTestId('radio-en-US'));

    expect(mockReplace).toHaveBeenCalledWith('/en-US/about');
  });
});
