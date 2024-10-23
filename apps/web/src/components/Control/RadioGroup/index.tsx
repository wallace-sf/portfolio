'use client';

import { type FC, createElement } from 'react';

import { type RadioGroupProps } from './RadioGroupTypes';

export const RadioGroup: FC<RadioGroupProps> = ({
  className,
  name,
  value,
  containerElementType = 'div',
  onChange,
  children,
}) => {
  return createElement(
    containerElementType,
    { className },
    children instanceof Function
      ? children({ name, value, onChange })
      : children,
  );
};

export type {
  RadioGroupProps,
  RadioGroupChildrenFn,
  IRadioGroupContext,
} from './RadioGroupTypes';
