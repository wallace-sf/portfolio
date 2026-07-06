/**
 * @vitest-environment jsdom
 */
import React from 'react';

import { render, screen } from '@testing-library/react';

import { ButtonLink } from '@repo/ui/Control/Button/Link';

describe('ButtonLink', () => {
  it('should render a native anchor element when no component prop is provided', () => {
    render(<ButtonLink href="/resume.pdf">Download resume</ButtonLink>);

    const link = screen.getByRole('link', { name: 'Download resume' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/resume.pdf');
  });

  it('should render the injected component when component prop is provided', () => {
    const MockLink = ({
      href,
      children,
      ...props
    }: {
      href: string;
      children: React.ReactNode;
    }) => (
      <a data-testid="mock-link" href={href} {...props}>
        {children}
      </a>
    );

    render(
      <ButtonLink component={MockLink} href="/projects/personal-portfolio">
        View project
      </ButtonLink>,
    );

    const link = screen.getByTestId('mock-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/projects/personal-portfolio');
    expect(link).toHaveTextContent('View project');
  });

  it('should pass extra props through to the injected component', () => {
    const MockLink = ({
      href,
      children,
      ...props
    }: {
      href: string;
      children: React.ReactNode;
    }) => (
      <a data-testid="mock-link" href={href} {...props}>
        {children}
      </a>
    );

    render(
      <ButtonLink
        component={MockLink}
        href="https://example.com/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download resume
      </ButtonLink>,
    );

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should apply button variant classes to the injected component', () => {
    const MockLink = ({
      href,
      children,
      className,
    }: {
      href: string;
      children: React.ReactNode;
      className?: string;
    }) => (
      <a data-testid="mock-link" href={href} className={className}>
        {children}
      </a>
    );

    render(
      <ButtonLink component={MockLink} href="/projects/personal-portfolio">
        View project
      </ButtonLink>,
    );

    const link = screen.getByTestId('mock-link');
    expect(link.className).toContain('bg-brand-primary');
  });
});
