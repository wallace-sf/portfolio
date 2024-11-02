'use client';

import { forwardRef, ForwardRefRenderFunction } from 'react';

import { isIn } from '@repo/utils';

import { Input, InputProps } from '~components/Control/Input';
import { withFormik } from '~hocs';
import { IFieldProps } from '~types';
import { createFieldClassName } from '~utils';

export interface ITextFieldProps extends Omit<InputProps, 'type'>, IFieldProps {
  type: 'text' | 'email' | 'password';
}

const Component: ForwardRefRenderFunction<
  HTMLInputElement | null,
  ITextFieldProps
> = (
  {
    className = '',
    error = false,
    errorBorder = true,
    touched = false,
    type,
    unstyled = false,
    ...props
  },
  ref,
) => {
  return (
    <Input
      {...props}
      type={isIn(type, ['text', 'email', 'password']) ? type : 'text'}
      className={createFieldClassName({
        error,
        errorBorder,
        touched,
        unstyled,
        className,
      })}
      ref={ref}
    />
  );
};

Component.displayName = 'TextField.Base';

export const Base = forwardRef(Component);

export const WithFormik = withFormik(Base, { errorBorder: true })({
  type: 'text',
});