'use client';

import { forwardRef, ForwardRefRenderFunction } from 'react';

import { isIn } from '@repo/utils';
import classNames from 'classnames';

import { Input, InputProps } from '~components/Control/Input';
import { withFormik } from '~hocs';
import { IFieldProps } from '~types';

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
      className={classNames(
        {
          '!border-error': error && errorBorder && touched && !unstyled,
          '!border-accent':
            error == null && errorBorder && touched && !unstyled,
          'border-2 border-dark-500 bg-dark-300 h-12 rounded-xl p-3 w-full text-sm font-medium text-white placeholder:font-normal focus:!border-primary active:!border-primary placeholder:text-dark-500 disabled:bg-whiter disabled:cursor-default dark:text-white !outline-0':
            !unstyled,
        },
        className,
      )}
      ref={ref}
    />
  );
};

Component.displayName = 'TextField.Base';

export const Base = forwardRef(Component);

export const WithFormik = withFormik(Base, { errorBorder: true })({
  type: 'text',
});
