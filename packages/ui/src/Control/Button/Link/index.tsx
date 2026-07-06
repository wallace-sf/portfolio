'use client';

import { AnchorHTMLAttributes, ElementType } from 'react';

import { buttonVariants, ButtonAppearance, ButtonSize } from '../variants';

export interface IButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: ButtonSize;
  appearance?: ButtonAppearance;
  unstyled?: boolean;
  component?: ElementType;
}

export const ButtonLink = ({
  children,
  className,
  size = 'large',
  appearance = 'filled',
  unstyled = false,
  component: Component = 'a',
  ...props
}: IButtonLinkProps) => {
  return (
    <Component
      {...props}
      className={buttonVariants({ size, appearance, unstyled, className })}
    >
      {children}
    </Component>
  );
};
