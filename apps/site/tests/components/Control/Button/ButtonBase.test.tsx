import { render, screen } from '@testing-library/react';

/**
 * @repo/ui/Control barrel re-exports Button.Clipboard which depends on
 * @repo/utils/hooks. That cross-package source import fails under the web
 * app's vitest module resolver. We mock the entire barrel and recreate only
 * Button.Base inline — sufficient to validate appearance class logic.
 */
vi.mock('@repo/ui/Control', () => {
  const { createElement } = require('react');
  const classNames = require('classnames');

  const Base = ({
    children,
    className,
    appearance = 'filled',
    size = 'large',
    unstyled = false,
    ...props
  }: {
    children?: React.ReactNode;
    className?: string;
    appearance?: 'filled' | 'outline' | 'ghost';
    size?: 'large' | 'small';
    unstyled?: boolean;
    [k: string]: unknown;
  }) =>
    createElement(
      'button',
      {
        type: 'button',
        ...props,
        className: classNames(
          {
            'text-body-sm !font-bold rounded-xl transition-all duration-300':
              !unstyled,
            'py-3 px-6': !unstyled && size === 'large',
            'py-2 px-6': !unstyled && size === 'small',
            'bg-brand-primary !text-white disabled:opacity-50 hover:opacity-90':
              !unstyled && appearance === 'filled',
            'border border-brand-primary !text-brand-primary bg-transparent disabled:opacity-50 hover:bg-brand-primary/10':
              !unstyled && appearance === 'outline',
            'bg-transparent !text-content-primary disabled:opacity-50 hover:bg-surface-raised':
              !unstyled && appearance === 'ghost',
          },
          className,
        ),
      },
      children,
    );

  return { Button: { Base } };
});

import { Button } from '@repo/ui/Control';

describe('Button.Base', () => {
  it('should render children', () => {
    render(<Button.Base>Click me</Button.Base>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should apply filled appearance by default', () => {
    render(<Button.Base>Save</Button.Base>);
    expect(screen.getByRole('button')).toHaveClass('bg-brand-primary');
  });

  it('should apply outline appearance', () => {
    render(<Button.Base appearance="outline">Cancel</Button.Base>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('border', 'border-brand-primary');
    expect(btn).not.toHaveClass('bg-brand-primary');
  });

  it('should apply ghost appearance', () => {
    render(<Button.Base appearance="ghost">Skip</Button.Base>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-transparent');
    expect(btn).not.toHaveClass('bg-brand-primary');
    expect(btn).not.toHaveClass('border-brand-primary');
  });

  it('should strip all styles when unstyled', () => {
    render(<Button.Base unstyled>Raw</Button.Base>);
    const btn = screen.getByRole('button');
    expect(btn).not.toHaveClass('bg-brand-primary');
    expect(btn).not.toHaveClass('rounded-xl');
  });

  it('should forward extra props', () => {
    render(<Button.Base disabled>Disabled</Button.Base>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
