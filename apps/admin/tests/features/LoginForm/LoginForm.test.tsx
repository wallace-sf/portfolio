/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock('@repo/ui/Control', () => ({
  Button: {
    Base: ({
      children,
      ...props
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button {...props}>{children}</button>
    ),
  },
  Text: {
    Base: React.forwardRef(
      (
        props: React.InputHTMLAttributes<HTMLInputElement> & {
          error?: boolean;
          touched?: boolean;
          errorBorder?: boolean;
          unstyled?: boolean;
        },
        ref: React.Ref<HTMLInputElement>,
      ) => {
        const {
          error: _e,
          touched: _t,
          errorBorder: _eb,
          unstyled: _u,
          ...rest
        } = props;
        return <input ref={ref} {...rest} />;
      },
    ),
  },
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

async function renderForm() {
  const { LoginForm } = await import('~/features/login/LoginForm');
  render(<LoginForm />);
}

describe('LoginForm', () => {
  it('should render email and password fields', async () => {
    await renderForm();

    expect(
      screen.getByPlaceholderText('LoginForm.emailPlaceholder'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('LoginForm.passwordPlaceholder'),
    ).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    await renderForm();
    const user = userEvent.setup();

    await user.click(screen.getByText('LoginForm.submit'));

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it('should call sign-in API with credentials on valid submit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null, error: null }),
    });

    await renderForm();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('LoginForm.emailPlaceholder'),
      'admin@test.com',
    );
    await user.type(
      screen.getByPlaceholderText('LoginForm.passwordPlaceholder'),
      'password123',
    );
    await user.click(screen.getByText('LoginForm.submit'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/auth/sign-in',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('admin@test.com'),
        }),
      );
    });
  });

  it('should show generic error when API returns error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        data: null,
        error: { code: 'INVALID_CREDENTIALS', message: 'Bad credentials' },
      }),
    });

    await renderForm();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('LoginForm.emailPlaceholder'),
      'admin@test.com',
    );
    await user.type(
      screen.getByPlaceholderText('LoginForm.passwordPlaceholder'),
      'wrongpassword',
    );
    await user.click(screen.getByText('LoginForm.submit'));

    await waitFor(() => {
      expect(screen.getByText('LoginForm.genericError')).toBeInTheDocument();
    });
  });

  it('should show generic error when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    await renderForm();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('LoginForm.emailPlaceholder'),
      'admin@test.com',
    );
    await user.type(
      screen.getByPlaceholderText('LoginForm.passwordPlaceholder'),
      'password123',
    );
    await user.click(screen.getByText('LoginForm.submit'));

    await waitFor(() => {
      expect(screen.getByText('LoginForm.genericError')).toBeInTheDocument();
    });
  });

  it('should redirect to admin on successful sign-in', async () => {
    const pushMock = vi.fn();
    const { useRouter } = await import('next/navigation');
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
    } as unknown as ReturnType<typeof useRouter>);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null, error: null }),
    });

    await renderForm();
    const user = userEvent.setup();

    await user.type(
      screen.getByPlaceholderText('LoginForm.emailPlaceholder'),
      'admin@test.com',
    );
    await user.type(
      screen.getByPlaceholderText('LoginForm.passwordPlaceholder'),
      'password123',
    );
    await user.click(screen.getByText('LoginForm.submit'));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('admin');
    });
  });
});
