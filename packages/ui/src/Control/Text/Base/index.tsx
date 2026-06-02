'use client';

import { forwardRef, ForwardRefRenderFunction } from 'react';

import { isIn } from '@repo/utils';
import classNames from 'classnames';

import { Icon } from '~/Imagery/Icon';
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
  const hasError = error && errorBorder && touched && !unstyled;
  const hasSuccess = !error && errorBorder && touched && !unstyled;
  const showIcon = (hasError || hasSuccess) && !unstyled;

  return (
    <div className={classNames('relative w-full', { 'w-full': !unstyled })}>
      <Input
        {...props}
        type={isIn(type, ['text', 'email', 'password']) ? type : 'text'}
        className={classNames(
          {
            'h-11 px-2 py-3 rounded-xl border border-content-disabled bg-transparent w-full text-sm text-content-primary placeholder:text-content-secondary focus:outline-none focus:border-content-secondary disabled:opacity-50 disabled:cursor-default':
              !unstyled,
            '!border-error': hasError,
            '!border-success': hasSuccess,
            'pr-8': showIcon && !unstyled,
          },
          className,
        )}
        ref={ref}
      />
      {showIcon && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          {hasError ? (
            <Icon
              icon="material-symbols:cancel"
              className="text-error text-base"
            />
          ) : (
            <Icon
              icon="material-symbols:check-circle"
              className="text-success text-base"
            />
          )}
        </span>
      )}
    </div>
  );
};

Component.displayName = 'Text.Base';

export const Base = forwardRef(Component);
