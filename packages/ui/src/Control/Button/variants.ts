import classNames from 'classnames';

export type ButtonSize = 'large' | 'small';
export type ButtonAppearance = 'filled' | 'outline' | 'ghost';

export interface ButtonVariantsOptions {
  size?: ButtonSize;
  appearance?: ButtonAppearance;
  unstyled?: boolean;
  className?: string;
}

export function buttonVariants({
  size = 'large',
  appearance = 'filled',
  unstyled = false,
  className,
}: ButtonVariantsOptions = {}): string {
  return classNames(
    {
      'text-body-sm !font-bold rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary':
        !unstyled,
      'py-3 px-6': !unstyled && size === 'large',
      'py-2 px-6': !unstyled && size === 'small',

      'bg-brand-primary text-content-primary [.light_&]:text-white disabled:opacity-50 [.light_&]:disabled:opacity-100 [.light_&]:disabled:bg-content-muted hover:bg-brand-primary-hover [.light_&]:active:bg-brand-primary-active':
        !unstyled && appearance === 'filled',

      'border border-brand-primary !text-brand-primary bg-transparent disabled:opacity-50 hover:bg-brand-primary/10':
        !unstyled && appearance === 'outline',

      'bg-transparent !text-content-primary disabled:opacity-50 hover:bg-surface-raised':
        !unstyled && appearance === 'ghost',
    },
    className,
  );
}
