import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContactForm } from '~/components/Forms/ContactForm';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next-intl', () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
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
        const { error: _e, touched: _t, errorBorder: _eb, unstyled: _u, ...rest } = props;
        return <input ref={ref} {...rest} />;
      },
    ),
  },
  TextArea: {
    Base: React.forwardRef(
      (
        props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
          error?: boolean;
          touched?: boolean;
          errorBorder?: boolean;
          unstyled?: boolean;
        },
        ref: React.Ref<HTMLTextAreaElement>,
      ) => {
        const { error: _e, touched: _t, errorBorder: _eb, unstyled: _u, ...rest } = props;
        return <textarea ref={ref} {...rest} />;
      },
    ),
  },
}));

const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fillForm(name = 'Alice', email = 'alice@example.com', message = 'Hello') {
  userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), name);
  userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), email);
  userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), message);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ContactForm', () => {
  it('should render name, email and message fields', () => {
    render(<ContactForm />);

    expect(screen.getByPlaceholderText('ContactForm.namePlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ContactForm.emailPlaceholder')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ContactForm.messagePlaceholder')).toBeInTheDocument();
  });

  it('should show required errors when submitting an empty form', async () => {
    render(<ContactForm />);

    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should show email validation error when email is invalid', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'not-an-email');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(screen.getByText('Validations.email')).toBeInTheDocument();
    });
  });

  it('should call POST /api/v1/contact with correct payload on valid submission', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ data: null, error: null }),
    });

    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'alice@example.com');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', message: 'Hello' }),
      });
    });
  });

  it('should show success message after successful submission', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ data: null, error: null }),
    });

    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'alice@example.com');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(screen.getByText('ContactForm.success')).toBeInTheDocument();
    });
  });

  it('should set field error when API returns INVALID_EMAIL', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        data: null,
        error: { code: 'INVALID_EMAIL', message: 'Valid email is required.' },
        meta: { status: 400 },
      }),
    });

    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'alice@example.com');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should show generic error when API returns unknown error code', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        data: null,
        error: { code: 'INTERNAL_ERROR', message: 'Server error.' },
        meta: { status: 500 },
      }),
    });

    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'alice@example.com');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(screen.getByText('ContactForm.genericError')).toBeInTheDocument();
    });
  });
});
