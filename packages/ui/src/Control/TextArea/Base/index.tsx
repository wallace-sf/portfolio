'use client';

import {
  forwardRef,
  ForwardRefRenderFunction,
  type TextareaHTMLAttributes,
} from 'react';

import classNames from 'classnames';

import { withFormik } from '~hocs';
import { IFieldProps } from '~types';

export interface ITextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    IFieldProps {}

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
      aria-disabled={props.disabled}
      aria-placeholder={props.placeholder}
      {...props}
      ref={ref}
      onChange={props.disabled ? undefined : props.onChange}
      onBlur={props.disabled ? undefined : props.onBlur}
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
    />
  );
};

Component.displayName = 'TextArea.Base';

export const Base = forwardRef(Component);

export const WithFormik = withFormik(Base, { errorBorder: true })({
  type: 'text',
});
