'use client';

import {
  forwardRef,
  ForwardRefRenderFunction,
  type TextareaHTMLAttributes,
} from 'react';

import { withFormik } from '~hocs';
import { IFieldProps } from '~types';
import { createFieldClassName } from '~utils';

export interface ITextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    IFieldProps {}

const Component: ForwardRefRenderFunction<
  HTMLTextAreaElement | null,
  ITextAreaFieldProps
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
      aria-disabled={props.disabled}
      aria-placeholder={props.placeholder}
      {...props}
      ref={ref}
      onChange={props.disabled ? undefined : props.onChange}
      onBlur={props.disabled ? undefined : props.onBlur}
      className={createFieldClassName({
        error,
        errorBorder,
        touched,
        unstyled,
        className,
      })}
    />
  );
};

Component.displayName = 'TextAreaField.Base';

export const Base = forwardRef(Component);

export const WithFormik = withFormik(Base, { errorBorder: true })({
  type: 'text',
});
