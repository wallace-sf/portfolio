/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

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

    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('contact-info')).toBeInTheDocument();
  });
});
