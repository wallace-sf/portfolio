/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

vi.mock('next/dynamic', () => ({
  default: (fn: () => Promise<React.FC>, _opts?: unknown) => {
    const Lazy = React.lazy(async () => {
      const Component = await fn();
      return { default: Component };
    });
    return (props: Record<string, unknown>) => (
      <React.Suspense fallback={null}>
        <Lazy {...props} />
      </React.Suspense>
    );
  },
}));

vi.mock('@repo/ui/View', () => ({
  Divider: () => <hr />,
}));

vi.mock('~features/contact/ContactForm', () => ({
  ContactForm: () => <div data-testid="contact-form" />,
}));

vi.mock('~features/contact/ContactInfo', () => ({
  ContactInfo: () => <div data-testid="contact-info" />,
}));

describe('ContactSection', () => {
  it('should render contact form and contact info', async () => {
    const { ContactSection } = await import(
      '~features/contact/ContactSection'
    );
    render(React.createElement(ContactSection));

    await waitFor(() =>
      expect(screen.getByTestId('contact-form')).toBeInTheDocument(),
    );
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
  });
});
