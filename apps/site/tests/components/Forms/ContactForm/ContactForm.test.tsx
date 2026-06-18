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
  Label: ({ children, htmlFor }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
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
  it('should render title as h2 heading', () => {
    render(<ContactForm />);
    const heading = screen.getByRole('heading', { level: 2, name: 'ContactForm.title' });
    expect(heading).toBeInTheDocument();
  });

  it('should render fieldset labeled by the h2 heading', () => {
    render(<ContactForm />);
    const fieldset = screen.getByRole('group', { name: 'ContactForm.title' });
    expect(fieldset).toBeInTheDocument();
  });

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
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello world!');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(screen.getByText('Validations.email')).toBeInTheDocument();
    });
  });

  it('should set window.location.href to a mailto: link on valid submission', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'alice@example.com');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello world!');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(locationMock.href).toMatch(/^mailto:/);
    });
  });

  it('should show success message after form submission', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Alice');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.emailPlaceholder'), 'alice@example.com');
    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hello world!');
    await userEvent.click(screen.getByRole('button', { name: 'ContactForm.submit' }));

    await waitFor(() => {
      expect(screen.getByText('ContactForm.success')).toBeInTheDocument();
    });
  });

  it('should show min error when name has fewer than 3 characters', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.namePlaceholder'), 'Al');

    await waitFor(() => {
      expect(screen.getByText('Validations.min')).toBeInTheDocument();
    });
  });

  it('should show min_message error when message has fewer than 10 characters', async () => {
    render(<ContactForm />);

    await userEvent.type(screen.getByPlaceholderText('ContactForm.messagePlaceholder'), 'Hi');

    await waitFor(() => {
      expect(screen.getByText('Validations.min_message')).toBeInTheDocument();
    });
  });

  it('should show required error when name is cleared after typing', async () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText('ContactForm.namePlaceholder');

    await userEvent.type(nameInput, 'Alice');
    await userEvent.clear(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Validations.required')).toBeInTheDocument();
    });
  });

  it('should show required error when focusing and blurring a field without typing', async () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText('ContactForm.namePlaceholder');

    await userEvent.click(nameInput);
    await userEvent.tab();

    await waitFor(() => {
      expect(screen.getByText('Validations.required')).toBeInTheDocument();
    });
  });
});
