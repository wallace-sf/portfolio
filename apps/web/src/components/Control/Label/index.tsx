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
        'text-body-sm xl:text-body-base !text-white !font-bold mb-2 text-start',
        className,
      )}
    >
      {children}
    </label>
  );
};
