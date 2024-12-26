'use client';

import {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
} from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Component: ForwardRefRenderFunction<
  HTMLInputElement | null,
  InputProps
> = ({ ...props }, ref) => {
  return (
    <input
      aria-disabled={props.disabled}
      aria-placeholder={props.placeholder}
      {...props}
      ref={ref}
      onChange={props.disabled ? undefined : props.onChange}
      onBlur={props.disabled ? undefined : props.onBlur}
    />
  );
};

Component.displayName = 'Input';

export const Input = forwardRef(Component);
