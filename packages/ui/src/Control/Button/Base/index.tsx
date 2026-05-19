'use client';

import { ButtonHTMLAttributes, FC } from 'react';

import classNames from 'classnames';

type Size = 'large' | 'small';
type Appearance = 'filled' | 'outline' | 'ghost';

export interface IButtonBaseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  appearance?: Appearance;
  unstyled?: boolean;
}

export const ButtonBase: FC<IButtonBaseProps> = ({
  children,
  className,
  size = 'large',
  appearance = 'filled',
  unstyled = false,
  ...props
}) => {
  return (
    <button
      type="button"
      {...props}
      className={classNames(
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
      )}
    >
      {children}
    </button>
  );
};
