'use client';

import { FC, LabelHTMLAttributes } from 'react';

import classNames from 'classnames';

export interface ILabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'id'> {}

export const Label: FC<ILabelProps> = ({
  children,
  htmlFor = '',
  className = '',
  ...props
}) => {
  return (
    <label
      {...props}
      id={`${htmlFor}-label`}
      htmlFor={htmlFor}
      className={classNames(
        'block text-base font-bold text-content-primary [.light_&]:text-content-secondary text-start',
        className,
      )}
    >
      {children}
    </label>
  );
};
