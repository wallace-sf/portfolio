import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContactForm } from '~/features/contact/ContactForm';

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

let locationMock: { href: string };

beforeEach(() => {
  locationMock = { href: '' };
  vi.stubGlobal('location', locationMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

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

  it('should set window.location.href to a mailto: link on valid submission', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'alice@example.com');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(locationMock.href).toMatch(/^mailto:/);
    });
  });

  it('should show success message after form submission', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'alice@example.com');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(screen.getByText('ContactForm.success')).toBeInTheDocument();
    });
  });
});
