'use client';

import { AnchorHTMLAttributes, FC } from 'react';

import { buttonVariants, ButtonAppearance, ButtonSize } from '../variants';

export interface IButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: ButtonSize;
  appearance?: ButtonAppearance;
  unstyled?: boolean;
}

export const ButtonLink: FC<IButtonLinkProps> = ({
  children,
  className,
  size = 'large',
  appearance = 'filled',
  unstyled = false,
  ...props
}) => {
  return (
    <a
      {...props}
      className={buttonVariants({ size, appearance, unstyled, className })}
    >
      {children}
    </a>
  );
};
