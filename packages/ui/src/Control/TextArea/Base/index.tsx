'use client';

import {
  forwardRef,
  ForwardRefRenderFunction,
  type TextareaHTMLAttributes,
} from 'react';

import classNames from 'classnames';

import { IFieldProps } from '~types';

export interface ITextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>, IFieldProps {}

const Component: ForwardRefRenderFunction<
  HTMLTextAreaElement | null,
  ITextAreaProps
> = (
  {
    className = '',
    error = false,
    errorBorder = true,
    touched = false,
    unstyled = false,
    ...props
  },
  ref,
) => {
  return (
    <textarea
      {...props}
      ref={ref}
      onChange={props.disabled ? undefined : props.onChange}
      onBlur={props.disabled ? undefined : props.onBlur}
      className={classNames(
        {
          '!border-error': error && errorBorder && touched && !unstyled,
          '!border-accent': !error && errorBorder && touched && !unstyled,
          'border border-border-default bg-surface h-12 rounded-xl p-3 w-full text-sm font-medium text-content-primary placeholder:font-normal placeholder:text-content-muted disabled:opacity-50 disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary':
            !unstyled,
        },
        className,
      )}
    />
  );
};

Component.displayName = 'TextArea.Base';

export const Base = forwardRef(Component);
