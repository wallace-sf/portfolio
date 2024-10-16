'use client';

import { FC, ButtonHTMLAttributes } from 'react';

import classNames from 'classnames';

type Variant = 'large' | 'small';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  unstyled?: boolean;
}

export const Button: FC<IButtonProps> = ({
  children,
  className,
  variant = 'large',
  unstyled = false,
  ...props
}) => {
  return (
    <button
      type="button"
      {...props}
      className={classNames(
        {
          'bg-primary text-body-sm !text-white !font-bold rounded-xl disabled:bg-blue-light hover:bg-blue-dark transition-all duration-300':
            !unstyled,
          'py-3 px-6': !unstyled && variant === 'large',
          'py-2 px-6': !unstyled && variant === 'small',
        },
        className,
      )}
    >
      {children}
    </button>
  );
};
