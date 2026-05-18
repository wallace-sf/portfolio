'use client';

import { forwardRef, ForwardRefRenderFunction } from 'react';

import { isIn } from '@repo/utils';
import classNames from 'classnames';

import { Input, InputProps } from '~/Control/Input';
import { IFieldProps } from '~types';

export interface ITextProps extends Omit<InputProps, 'type'>, IFieldProps {
  type: 'text' | 'email' | 'password';
}

const Component: ForwardRefRenderFunction<
  HTMLInputElement | null,
  ITextProps
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
          'border-2 border-border-default bg-surface h-12 rounded-xl p-3 w-full text-sm font-medium text-content-primary placeholder:font-normal focus:!border-primary active:!border-primary placeholder:text-content-muted disabled:opacity-50 disabled:cursor-default !outline-0':
            !unstyled,
        },
        className,
      )}
      ref={ref}
    />
  );
};

Component.displayName = 'Text.Base';

export const Base = forwardRef(Component);
